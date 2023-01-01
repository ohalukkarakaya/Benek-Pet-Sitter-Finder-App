import express from "express";
import User from "../../models/User.js";
import Pet from "../../models/Pet.js";
import CareGive from "../../models/CareGive/CareGive.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import auth from "../../middleware/auth.js";
import QRCode from "qrcode";
import missionEndPoints from "./mission/mission.js";

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

            if(
                !petId
                || !startDate
                || !endDate
                || !meetingAdress
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

            if(pet.primaryOwner.toString() === req.user._id.toString()){
                return res.status(400).json(
                    {
                        error: true,
                        message: "Pet belongs to you"
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

            if(Date.parse(startDate) < Date.now() || Date.parse(endDate) < Date.parse(startDate)){
                return res.status(400).json(
                    {
                        error: true,
                        message: "invalid start or end date"
                    }
                );
            }

            const careGiver = await User.findById(req.user._id.toString());
            const owner = await User.findById(pet.primaryOwner.toString());
            if(!owner || !careGiver){
                return res.status(404).json(
                    {
                        error: true,
                        messsage: "user not found"
                    }
                );
            }
            const isOwnerVerified = owner.email;
            const isCareGiverVerified = careGiver.isCareGiver && careGiver.email && careGiver.phone && careGiver.iban;
            if(!isCareGiverVerified){
                return res.status(403).json(
                    {
                        error: true,
                        message: "you need to verify your phone number, email and bank accounts iban number"
                    }
                );
            }else{
                await new CareGive(
                    {
                        invitation: {
                            from: req.user._id.toString(),
                            to: req.body.userId.toString()
                        },
                        petId: pet._id.toString(),
                        careGiver: {
                            careGiverId: req.user._id.toString(),
                            careGiverContact: {
                                careGiverPhone: req.user.phone,
                                careGiverEmail: req.user.email
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
                                message: `user with th id "${req.body.ownerId}" invented to careGive`
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
                                petOwner.save().then(
                                    async (___) => {
                                        if(isPetOwner){
                                            const price = invitedCareGive.prices.servicePrice;
                                            if(price.priceType !== "Free" && price.price !== 0){
                                                //take payment in here
                                            }

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
);

//start care give
router.put(
    "/start/:careGiveId",
    auth,
    async (req, res) => {
        try{
            const careGiveId = req.params.careGiveId;
            const actionCodePassword = req.body.actionCodePassword;
            const petOwnerIdFromCode = req.body.petOwnerIdFromCode;
            const petIdFromCode = req.body.petIdFromCode;
            const careGiverIdFromCode = req.body.careGiverIdFromCode;
            const codeType = req.body.codeType;
            const userId = req.user._id.toString();
            if(
                !careGiveId
                || !actionCodePassword
                || !petOwnerIdFromCode
                || !petIdFromCode
                || !careGiverIdFromCode
                || !codeType
            ){
                return res.status(400).json(
                    {
                        error: true,
                        message: "missing params"
                    }
                );
            }

            if(codeType !== "start"){
                return res.status(400).json(
                    {
                        error: true,
                        message: "This is not a start code"
                    }
                );
            }

            const careGive = await CareGive.findById(careGiveId);
            if(!careGive){
                return res.status(404).json(
                    {
                        error: true,
                        message: "Care give not found"
                    }
                );
            }
            if(userId !== careGive.careGiver.careGiverId.toString()){
                return res.status(400).json(
                    {
                        error: true,
                        message: "care giver should scan this code"
                    }
                );
            }

            const pet = await Pet.findById(careGive.petId.toString());
            if(!pet){
                return res.status(404).json(
                    {
                        error: true,
                        message: "Pet not found"
                    }
                );
            }

            const careGiver = await User.findById(userId);
            if(!careGiver){
                return res.status(404).json(
                    {
                        error: true,
                        message: "Care giver not found"
                    }
                );
            }

            const petOwner = await User.findById(careGive.petOwner.petOwnerId.toString());
            if(!petOwner){
                return res.status(404).json(
                    {
                        error: true,
                        message: "pet owner not found"
                    }
                );
            }

            if(
                pet._id.toString !== petIdFromCode
                || userId !== careGiverIdFromCode
                || petOwner._id.toString() !== petOwnerIdFromCode
            ){
                return res.status(400).json(
                    {
                        error: true,
                        message: "data in code is invalid"
                    }
                );
            }

            if(
                Date.parse(careGive.startDate) > Date.now()
                || Date.parse(careGive.startDate) < Date.now()
            ){
                return res.status(400).json(
                    {
                        error: true,
                        message: "care give was past"
                    }
                );
            }

            const verifiedPassword = await bcrypt.compare(
                actionCodePassword,
                careGive.invitation.actionCode.code
            );
            if(!verifiedPassword){
                return res.status(403).json(
                    {
                        error: true,
                        message: "Invalid password"
                    }
                );
            }

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

                    careGive.actionCode.codeType = "Finish";
                    careGive.actionCode.codePassword = hashCodePassword;
                    careGive.actionCode.code = url;
                    careGive.markModified("actionCode");

                    careGive.isStarted = true;
                    careGive.markModified("isStarted");

                    careGive.save().then(
                        (carGiveObject) => {
                            return res.status(200).json(
                                {
                                    error: false,
                                    message: "care give started succesfully",
                                    finishCode: url
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
        }catch(err){
            console.log("Error: start care give - ", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);

router.use("/mission", missionEndPoints);

export default router;

//TO DO: give star to care giver
//TO DO: plan care give for a pet
//TO DO: plan care give missions
//TO DO: upload care give mission
//TO DO: approve care give mission