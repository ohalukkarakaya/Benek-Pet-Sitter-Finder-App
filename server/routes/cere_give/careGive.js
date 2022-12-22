import express from "express";
import User from "../../models/User.js";
import Pet from "../../models/Pet.js";
import CareGive from "../../models/CareGive/CareGive.js";
import dotenv from "dotenv";
import auth from "../../middleware/auth.js";

dotenv.config();

const router = express.Router();

//invite a user to care give
router.post(
    "/",
    auth,
    async (req, res) => {
        try{
            const petId = req.body.petId;
            const startDate = req.body.startDate;
            const endDate = req.body.endDate;
            const meetingAdress = req.body.meetingAdress;
            const userId = req.params.userId.toString;

            if(
                !petId
                || !startDate
                || !endDate
                || !meetingAdress
                || !userId
            ){
                return res.status(400).json(
                    {
                        error: true,
                        message: "missing params"
                    }
                );
            }


            const price = req.body.price;
            if(price){
                if(!price.servicePrice || !price.extraServicesPrice){
                    return res.status(400).json(
                        {
                            error: true,
                            message: "missing params"
                        }
                    );
                }
            }

            const pet = await Pet.findById(petId);
            if(!pet){
                return res.status(404).json(
                    {
                        error: true,
                        message: "Pet not found"
                    }
                );
            }

            const isPetAlreadyInCareGive = CareGive.find(
                careGiveObject =>
                    careGiveObject.petId.toString() === pet._id.toString()
                    && Date.now() < Date.parse( careGiveObject.endDate )
            );
            if(isPetAlreadyInCareGive){
                return res.status(403).json(
                    {
                        error: true,
                        message: "pet is already with a care giver currently"
                    }
                );
            }

            let ownerId;
            let careGiverId;
            if(pet.primaryOwner.toString() === req.user._id.toString()){
                ownerId = req.user._id.toString();
                careGiverId = req.body.userId.toString();
            }else if(pet.primaryOwner.toString() === req.body.userId.toString()){
                ownerId = req.body.userId.toString();
                careGiverId = req.user._id.toString();
            }else{
                return res.status(400).json(
                    {
                        error: true,
                        message: "You can open service only for pets owner"
                    }
                );
            }

            if(Date.parse(startDate) < Date.now() || Date.parse(endDate) < Date.parse(startDate)){
                return res.status(400).json(
                    {
                        error: true,
                        message: "invalid start or end date"
                    }
                );
            }

            const careGiver = await User.findById(careGiverId);
            const owner = await User.findById(ownerId);
            if(!owner || !careGiver){
                return res.status(404).json(
                    {
                        error: true,
                        messsage: "user not found"
                    }
                );
            }

            const isOwner = owner._id.toString() === req.user._id.toString();
            const isOwnerVerified = owner.email;

            const isCareGiver = careGiver._id.toString === req.user._id.toString();
            const isCareGiverVerified = careGiver.isCareGiver && careGiver.email && careGiver.phone && careGiver.iban;
            if(isCareGiver && !isCareGiverVerified){
                return res.status(403).json(
                    {
                        error: true,
                        message: "you need to verify your phone number, email and bank accounts iban number"
                    }
                );
            }else if(isOwner && !isOwnerVerified){
                return res.status(403).json(
                    {
                        error: true,
                        message: "You need to verify your email"
                    }
                );
            }else if(isCareGiver && isCareGiverVerified || isOwner && isOwnerVerified){
                await new CareGive(
                    {
                        invitation: {
                            from: req.user._id.toString(),
                            to: req.body.userId.toString()
                        },
                        petId: pet._id.toString(),
                        careGiver: {
                            careGiverId: careGiver._id.toString(),
                            careGiverContact: {
                                careGiverPhone: careGiver.phone,
                                careGiverEmail: careGiver.email
                            }
                        },
                        petOwner: {
                            petOwnerId: owner._id.toString(),
                            petOwnerContact: {
                                petOwnerEmail: owner.email,
                                petOwnerPhone: owner.phone
                            }
                        },
                        price: price,
                        startDate: startDate,
                        endDate: endDate,
                        adress: meetingAdress
                    }
                ).then(
                    (careGiveInvitation) => {
                        return res.status(200).json(
                            {
                                error: false,
                                message: `user with th id "${req.body.userId}" invented to careGive`
                            }
                        );
                    }
                ).catch(
                    (error) => {
                        if(error){
                            console.log("Error: while creating CareGiveObject - ", error);
                            return res.status(500).json(
                                {
                                    error: true,
                                    mesage: "Internal server error"
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
);

//accept invitation
router.put(
    "/:careGiveId/:response",
    auth,
    async (req,res) => {
        try{
            const careGiveId = req.params.careGiveId;
            const usersResponse = req.params.response;
            if(!careGiveId || !usersResponse){
                return res.status(400).json(
                    {
                        error: true,
                        message: "missing params"
                    }
                );
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

            if(invitedCareGive.invitation.to !== req.user._id.toString()){
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
                if(!careGiver){
                    return res.status(404).json(
                        {
                            error: false,
                            message: "user not found"
                        }
                    );
                }

                const petOwner = await User.findById( invitedCareGive.petOwner.petOwnerId.toString() );
                if(!petOwner){
                    return res.status(404).json(
                        {
                            error: true,
                            message: "user not found"
                        }
                    );
                }

                const isPetOwner = req.user._id.toString() === invitedCareGive.petOwner.petOwnerId.toString();
                const isCareGiver = req.user._id.toString() === invitedCareGive.careGiver.careGiverId.toString();
                if(isPetOwner  && !isCareGiver){
                    const isEmailValid = petOwner.email;
                    if(!isEmailValid){
                        return res.status(400).json(
                            {
                                error: true,
                                message: "please verify your email firstly"
                            }
                        );
                    }
                }else if(!isPetOwner && isCareGiver){
                    const isEmailValid = careGiver.email;
                    if(!isEmailValid){
                        return res.status(400).json(
                            {
                                error: true,
                                message: "please verify your email firstly"
                            }
                        );
                    }

                    const isPhoneValid = careGiver.phone;
                    if(!isPhoneValid){
                        return res.status(400).json(
                            {
                                error: true,
                                message: "Please verify your phone number firstly"
                            }
                        );
                    }

                    const isIbanValid = careGiver.iban;
                    if(!isIbanValid){
                        return res.status(400).json(
                            {
                                error: true,
                                message: "We need your iban to accept you as careGiver"
                            }
                        );
                    }
                }else{
                    return res.status(401).json(
                        {
                            error: true,
                            message: "You are not authorized for this action"
                        }
                    );
                }

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
                invitedCareGive.markModified("invitation");

                pet.save().then(
                    (_) => {
                        careGiver.save().then(
                            (__) => {
                                petOwner.save().then(
                                    (___) => {
                                        invitedCareGive.save().then(
                                            (____) => {
                                                const price = invitedCareGive.prices.servicePrice;
                                                if(price.priceType !== "Free" && price.price !== 0){
                                                    //take payment in here
                                                }
                                                res.status(200).json(
                                                    {
                                                        error: false,
                                                        message: "careGive accepted"
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
);

export default router;

//TO DO: give star to care giver
//TO DO: plan care give for a pet
//TO DO: plan care give missions
//TO DO: upload care give mission
//TO DO: approve care give mission