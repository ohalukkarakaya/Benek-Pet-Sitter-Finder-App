import express from "express";
import User from "../../models/User.js";
import Pet from "../../models/Pet.js";
import CareGive from "../../models/CareGive/CareGive.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import auth from "../../middleware/auth.js";
import QRCode from "qrcode";

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
                || !ownerId
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

//schedule care give
router.put(
    "/mission/schedule/:careGiveId",
    auth,
    async (req, res) => {
        try{
            const careGiveId = req.params.careGiveId.toString();
            const missionDesc = req.body.missionDesc.toString();
            const missionDate = Date.parse(req.body.missionDate.toString());

            if(!careGiveId || !missionDesc || !missionDate){
                return res.status(400).json(
                    {
                        error: true,
                        message: "Missing param"
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

            const areThereMissionAtSameTime = careGive.missionCallender.find(
                missionObject => 
                    missionObject.missionDate === missionDate
            );
            if(areThereMissionAtSameTime){
                return res.status(400).json(
                    {
                        error: true,
                        message: "there is allready mission scheduled at this time"
                    }
                );
            }

            careGive.missionCallender.push(
                {
                    missionDesc: missionDesc,
                    missionDate: missionDate,
                    missionDeadline: new Date.parse(missionDate + 1*60*60*1000),

                }
            );
            careGive.markModified("missionCallender");
            careGive.save().then(
                (savedMission) => {
                    if(savedMission){
                        return res.status(200).json(
                            {
                                error: false,
                                message: "mission inserted succesfully",
                                missionId :savedMission._id.toString()
                            }
                        );
                    }
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
        }catch(err){
            console.log("Error: schedule care give mission - ", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);

//accept mission
router.put(
    "/mission/acception/:careGiveId/:missionId/:response",
    auth,
    async (req, res) => {
        try{
            const userId = req.user._id.toString();
            const careGiveId = req.params.careGiveId;
            const missionId = req.params.missionId;
            const responseAsString = req.params.response;
            const extraPrice = req.body.extraServicePrice;
            const reasonToMakeExtra = req.body.reasonToMakeExtra
            let isExtra;

            if(!userId || !careGiveId || !missionId || !responseAsString){
                return res.status(400).json(
                    {
                        error: true,
                        message: "Missing params"
                    }
                );
            }

            if(responseAsString !== "true" && responseAsString!== "false"){
                return res.status(400).json(
                    {
                        error: true,
                        message: "response type can be boolean"
                    }
                );
            }

            if(
                reasonToMakeExtra && !extraPrice
                || !reasonToMakeExtra && extraPrice
                || extraPrice && !extraPrice.priceType
                || extraPrice && extraPrice.priceType && extraPrice.priceType !== "TL"
                || extraPrice && extraPrice.priceType && extraPrice.priceType !== "USD"
                || extraPrice && extraPrice.priceType && extraPrice.priceType !== "EUR"
                || extraPrice && !extraPrice.price
                || extraPrice && extraPrice.price && typeof extraPrice.price !== "number"
            ){
                return res.status(400).json(
                    {
                        error: true,
                        message: "invalid price value"
                    }
                );
            }

            const response = responseAsString === "true";

            if(extraPrice && response){
                isExtra = true;
            }else{
                isExtra = false;
            }

            const careGive = await CareGive.findById(careGiveId.toString());
            if(!careGive){
                return res.status(404).json(
                    {
                        error: true,
                        message: "care give not found"
                    }
                );
            }

            if(careGive.careGiver.careGiverId.toString !== userId){
                return res.status(401).json(
                    {
                        error: true,
                        message: "you can not accept this care give"
                    }
                );
            }

            const mission = careGive.missionCallender.find(
                missionObject =>
                    missionObject._id.toString() === missionId.toString()
            );
            if(!mission){
                return res.status(400).json(
                    {
                        error: true,
                        message: "Mission not found"
                    }
                );
            }

            if(Date.parse(mission.startDate) <= Date.now()){
                careGive.missionCallender = careGive.missionCallender.filter(
                    missionObject =>
                        missionObject._id.toString() !== missionId.toString()
                );
                careGive.markModified("missionCallender");
                careGive.save().then(
                    (_) => {
                        return res.status(400).json(
                            {
                                error: true,
                                message: "it is too late to accept so mission expired"
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
                                    message: "Internal Server Error"
                                }
                            );
                        }
                    }
                );
            }

            if(!response){
                careGive.missionCallender = careGive.missionCallender.filter(
                    missionObject =>
                        missionObject._id.toString() !== missionId.toString()
                );
                careGive.markModified("missionCallender");
                careGive.save().then(
                    (_) => {
                        return res.status(200).json(
                            {
                                error: false,
                                message: "mission refuse succesfully"
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
                                    message: "Internal Server Error"
                                }
                            );
                        }
                    }
                );
            }else if(response && !isExtra){
                mission.missionAcception.isAccepted = true;
                careGive.markModified("missionCallender");
                careGive.save().then(
                    (_) => {
                        return res.status(200).json(
                            {
                                error: false,
                                message: "mission accepted succesfully"
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
                                    message: "Internal Server Error"
                                }
                            );
                        }
                    }
                );
            }else if(response && isExtra){
                mission.missionAcception.isAccepted = true;
                mission.missionAcception.ReasonToMakeExtra = reasonToMakeExtra;
                mission.extra.isExtra = true;
                mission.extra.extraServicePrice.priceType = extraPrice.priceType;
                mission.extra.extraServicePrice.price = extraPrice.price;
                
                careGive.markModified("missionCallender");
                careGive.save().then(
                    (_) => {
                        return res.status(200).json(
                            {
                                error: false,
                                message: "mission marked as extra service succesfully"
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
                                    message: "Internal Server Error"
                                }
                            );
                        }
                    }
                );
            }



        }catch(err){
            console.log("Error: accept care give mission - ", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);

//accept missions extra service request
router.put(
    "/mission/extraAcception/:careGiveId/:missionId/:response",
    auth,
    async (req, res) => {
        try{
            const userId = req.user._id.toString();
            const careGiveId = req.params.careGiveId;
            const missionId = req.params.missionId;
            const responseAsString = req.params.response;
            if( !userId || !careGiveId || !missionId || !responseAsString ){
                return res.status(400).json(
                    {
                        error: true,
                        message: "missing params"
                    }
                );
            }

            if(responseAsString !== "true" && responseAsString!== "false"){
                return res.status(400).json(
                    {
                        error: true,
                        message: "response type can be boolean"
                    }
                );
            }

            const response = responseAsString === "true";

            const careGive = await CareGive.findById(careGiveId.toString());
            if(!careGive){
                return res.status(404).json(
                    {
                        error: true,
                        message: "careGive not found"
                    }
                );
            }
            if(careGive.petOwner.petOwnerId.toString !== userId.toString()){
                return res.status(401).json(
                    {
                        error: true,
                        message: "you are not authorized to accept this request"
                    }
                );
            }

            const mission = careGive.missionCallender.find(
                missionObject =>
                    missionObject._id.toString() === missionId.toString()
            );
            if(!mission){
                return res.status(404).json(
                    {
                        error: true,
                        message: "mission not found"
                    }
                );
            }
            if(
                !mission.missionAcception.isMissionAccepted
                || !mission.extra.isExtra
                || mission.extra.isExtraAccepted
                || mission.extra.extraServicePrice.priceType === "NotExtra"
                    && mission.extra.extraServicePrice.price === 0
            ){
                return res.status(400).json(
                    {
                        error: true,
                        message: "something wrong with your request"
                    }
                );
            }

            if(!response){
                careGive.missionCallender = careGive.missionCallender.filter(
                    missionObject => 
                        missionObject._id.toString() !== missionId.toString()
                );
                careGive.markModified("missionCallender");
                careGive.save().then(
                    (_) => {
                        return res.status(200).json(
                            {
                                error: false,
                                message: "mission refused succesfully"
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
                                    message: "Internal Server Error"
                                }
                            );
                        }
                    }
                );
            }else{
                const price = mission.extra.extraServicePrice.price;
                const priceType = mission.extra.extraServicePrice.priceType;
                // take payment here

                mission.isExtraAccepted = true;
                careGive.markModified("missionCallender");
                careGive.save().then(
                    (_) => {
                        return res.status(200).json(
                            {
                                error: false,
                                message: "extra service accepted succesfully"
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
                                    message: "Internal Server Error"
                                }
                            );
                        }
                    }
                );
            }


        }catch(err){
            console.log("Error: accept extra service mission - ", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }    
);

//get time code for upload mission
router.put(
    "/getTimeCode/:careGiveId/:missionId",
    auth,
    async (req, res) => {
        try{
            const careGiveId = req.params.careGiveId;
            const missionId = req.params.missionId;
            const userId = req.user._id.toString();

            if(!careGiveId || !missionId || !userId){
                return res.status(400).json(
                    {
                        error: true,
                        message: "missing params"
                    }
                );
            }

            const careGive = await CareGive.findById(careGiveId.toString());
            if(!careGive){
                return res.status(404).json(
                    {
                        error: true,
                        message: "Care give not found"
                    }
                );
            }

            if(careGive.careGiver.careGiverId.toString() !== userId){
                return res.status(401).json(
                    {
                        error: true,
                        message: "You are not authorized to upload this mission"
                    }
                );
            }

            const mission = careGive.missionCallender.find(
                missionObject =>
                    missionObject._id.toString() !== missionId.toString()
            );
            if(!mission){
                return res.status(404).json(
                    {
                        error: true,
                        message: "mission not found"
                    }
                );
            }

            if(
                !mission.missionAcception.isAccepted
                || mission.extra.isExtra && !mission.extra.isExtraAccepted
            ){
                return res.status(400).json(
                    {
                        error: true,
                        message: "mission not accepted yet"
                    }
                );
            }

            const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
            let password = "";
            for (let i = 0; i < 6; i++) {
                password += characters[Math.floor(Math.random() * characters.length)];
            }

            if(password !== ""){
                mission.missionContent.timeSignature.timePassword = password;
                mission.missionContent.timeSignature.expiresAt = Date.now() + 10 * 60 * 1000;

                careGive.markModified("missionCallender");
                careGive.save().then(
                    (_) => {
                        return res.status(200).json(
                            {
                                error: false,
                                message: "password created succesfully, it will expires in 10 min",
                                timeSignature: password
                            }
                        );
                    }
                ).catch(
                    (error) => {
                        console.log(err);
                        return res.status(500).json(
                            {
                                error: true,
                                message: "Internal Server Error"
                            }
                        );
                    }
                );
            }
        }catch(err){
            console.log(err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal Server Error"
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