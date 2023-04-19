import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";
import CareGive from "../../../models/CareGive/CareGive.js";

import dotenv from "dotenv";
import bcrypt from "bcrypt";
import QRCode from "qrcode";

dotenv.config();

const replyCareGiveInvitationController = async (req, res) => {
    try{
        const careGiveId = req.params.careGiveId;
        const usersResponse = req.params.response;
        let isCreditPayment = req.body.isCreditPayment;

        if(!careGiveId || !usersResponse){
            return res.status(400).json(
                {
                    error: true,
                    message: "missing params"
                }
            );
        }
        if(!isCreditPayment){
            isCreditPayment = false;
        }

        const invitedCareGive = await CareGive.findById(careGiveId);
        if(!invitedCareGive){
            return res.status(404).json(
                {
                    error: true,
                    message: "care give not found"
                }
            );
        }

        if(
            invitedCareGive.invitation.to !== req.user._id.toString()
            || req.user._id.toString() !== invitedCareGive.petOwner.toString()
        ){
            return res.status(401).json(
                {
                    error: true,
                    message: "you are not authorized to accept this invitation"
                }
            );
        }
        
        if(usersResponse !== "true" && usersResponse !== "false"){
            return res.status(400).json(
                {
                    error: true,
                    message: "Invalid response"
                }
            );
        }

        const response = usersResponse === "true";
        if(response){
            //accept invitation
            const pet = await Pet.findById( invitedCareGive.petId.toString() );
            if(!pet){
                return res.status(404).json(
                    {
                        error: true,
                        message: "pet not found"
                    }
                );
            }

            const careGiver = await User.findById( invitedCareGive.careGiver.careGiverId.toString() );
            if(!careGiver || careGiver.deactivation.isDeactive){
                return res.status(404).json(
                    {
                        error: false,
                        message: "user not found"
                    }
                );
            }

            const petOwner = await User.findById( invitedCareGive.petOwner.petOwnerId.toString() );
            if(!petOwner || petOwner.deactivation.isDeactive){
                return res.status(404).json(
                    {
                        error: true,
                        message: "user not found"
                    }
                );
            }

            const isPetOwner = req.user._id.toString() === invitedCareGive.petOwner.petOwnerId.toString();
            const isEmailValid = petOwner.email;
            if(!isEmailValid){
                return res.status(400).json(
                    {
                        error: true,
                        message: "please verify your email firstly"
                    }
                );
            }

            invitedCareGive.petOwner.petOwnerContact.petOwnerEmail = petOwner.email;
            invitedCareGive.petOwner.petOwnerContact.petOwnerPhone = petOwner.phone;
            invitedCareGive.markModified("petOwner");

            const careGiveHistoryRecordforPet = {
                careGiver: careGiver._id.toString(),
                startDate: invitedCareGive.startDate,
                endDate: invitedCareGive.endDate,
                price: invitedCareGive.prices
            }

            const careGiveHistoryRecordforCareGiver = {
                pet: pet._id.toString(),
                startDate: invitedCareGive.startDate,
                endDate: invitedCareGive.endDate,
                price: invitedCareGive.prices
            }

            const careGiveHistoryRecordforPetOwner = {
                pet: pet._id.toString(),
                careGiver: careGiver._id.toString(),
                startDate: invitedCareGive.startDate,
                endDate: invitedCareGive.endDate,
                price: invitedCareGive.prices
            }

            pet.careGiverHistory.push(careGiveHistoryRecordforPet);
            pet.markModified("careGiverHistory");

            careGiver.caregiverCareer.push(careGiveHistoryRecordforCareGiver);
            careGiver.markModified("caregiverCareer");

            petOwner.pastCaregivers.push(careGiveHistoryRecordforPetOwner);
            petOwner.markModified("pastCaregivers");

            invitedCareGive.invitation.isAccepted = true;

            pet.save().then(
                (_) => {
                    careGiver.save().then(
                        (__) => {
                            if(isPetOwner){
                                const price = invitedCareGive.prices;
                                if(price.priceType !== "Free" && price.servicePrice !== 0){
                                    if(isCreditPayment){
                                        const creditType = petOwner.refundCredit.priceType;
                                        const credit = petOwner.refundCredit.credit;

                                        if(creditType === price.priceType || credit < price.servicePrice){
                                            return res.status(400).json(
                                                {
                                                    error: true,
                                                    message: "Can't pay with credit"
                                                }
                                            );
                                        }
                                        petOwner.refundCredit.credit = credit - price.servicePrice;
                                        petOwner.markModified("refundCredit");
                                    }else{
                                            // const areThereCredit = await PaymentData.findOne(
                                            //     {
                                            //         from: invitedCareGive.invitation.to,
                                            //         isCanceled: true
                                            //     }
                                            // );
                                            // if(areThereCredit){
                                            //     //To Do: ! take payment
                                            // }
                                    }
                                }
                            }
                            petOwner.save().then(
                                async (___) => {
                                    if(isPetOwner){
                                        //generate password
                                        const randPassword = Buffer.from(Math.random().toString()).toString("base64").substring(0,20);
                                        const salt = await bcrypt.genSalt(Number(process.env.SALT));
                                        const hashCodePassword = await bcrypt.hash(randPassword, salt);

                                        //qr code data
                                        const data = {
                                            careGiveId: invitedCareGive._id.toString(),
                                            petOwner: req.user._id.toString(),
                                            careGiver: invitedCareGive.careGiver.careGiverId.toString(),
                                            pet: invitedCareGive.petId.toString(),
                                            codeType: "Start",
                                            codePassword: randPassword,
                                        }
                    
                                        let qrCodeData = JSON.stringify(data);

                                        // Get the base64 url
                                        QRCode.toDataURL(
                                            qrCodeData,
                                            function (err, url) {
                                                if(err){
                                                    return res.status(500).json(
                                                        {
                                                            error: true,
                                                            message: "error wile generating QR code"
                                                        }
                                                    );
                                                }

                                                invitedCareGive.invitation.actionCode.codeType = "Start";
                                                invitedCareGive.invitation.actionCode.codePassword = hashCodePassword;
                                                invitedCareGive.invitation.actionCode.code = url;
                                                invitedCareGive.markModified(invitation);
                                                invitedCareGive.save().then(
                                                    (____) => {
                                                        res.status(200).json(
                                                            {
                                                                error: false,
                                                                message: "careGive accepted",
                                                                code: url
                                                            }
                                                        );
                                                    }
                                                ).catch(
                                                    (er) => {
                                                        console.log(er);
                                                        return res.status(500).json(
                                                            {
                                                                error: true,
                                                                message: "Internal server error"
                                                            }
                                                        );
                                                    }
                                                );
                                            }
                                        );
                                    }
                                }
                            ).catch(
                                (err) => {
                                    console.log(err);
                                    return res.status(500).json(
                                        {
                                            error: true,
                                            message: "Internal server error"
                                        }
                                    );
                                }
                            );
                        }
                    ).catch(
                        (err) => {
                            console.log(err);
                            return res.status(500).json(
                                {
                                    error: true,
                                    message: "Internal server error"
                                }
                            );
                        }
                    );
                }
            ).catch(
                (err) => {
                    console.log(err);
                    return res.status(500).json(
                        {
                            error: true,
                            message: "Internal server error"
                        }
                    );
                }
            );
        }else{
            //reject invitation
            invitedCareGive.deleteOne().then(
                (_) => {
                    return res.status(200).json(
                        {
                            error: false,
                            message: "Invitation rejected succesfully"
                        }
                    );
                }
            ).catch(
                (error) => {
                    if(error){
                        console.log(error);
                        return res.status(500).json(
                            {
                                error: true,
                                message: "Internal server error"
                            }
                        );
                    }
                }
            );
        }
    }catch(err){
        console.log("Error: care give", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default replyCareGiveInvitationController;