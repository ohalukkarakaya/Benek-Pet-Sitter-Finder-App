import express from "express";
import CareGive from "../../models/CareGive/CareGive.js";
import User from "../../models/User.js";
import dotenv from "dotenv";
import auth from "../../middleware/auth.js";

dotenv.config();

const router = express.Router();

router.post(
    "/careGiveId",
    auth,
    async() => {
        try{
            const careGiveId = req.params.careGiveId.toString();
            if(!careGiveId){
                return res.status(400).json(
                    {
                        error: true,
                        message: "Missing params"
                    }
                );
            }

            const careGive = await CareGive.findById(careGiveId);
            if(!careGive){
                return res.status(404).json(
                    {
                        error: true,
                        message: "care give not found"
                    }
                );
            }

            if(req.user._id.toString() !== careGive.careGiver.careGiverId.toString()){
                return res.status(401).json(
                    {
                        error: true,
                        message: "You are not authorized for this"
                    }
                );
            }

            const petOwner = await User.findById( careGive.careGiver.careGiverId.toString() );
            if(!petOwner){
                return res.status(404).json(
                    {
                        error: true,
                        message: "Pet owner not found"
                    }
                );
            }

            let petOwnerPhone = careGive.petOwner.petOwnerContact.petOwnerPhone;
            if( !careGive.petOwner.petOwnerContact.petOwnerPhone ){
                petOwnerPhone = petOwner.phone;
            }

            let petOwnerEmail = careGive.petOwner.petOwnerContact.petOwnerEmail;
            if( !careGive.petOwner.petOwnerContact.petOwnerEmail ){
                petOwnerEmail = petOwner.email;
            }

            if(!petOwnerPhone && !petOwnerEmail){
                return res.status(404).json(
                    {
                        error: true,
                        message: "Pet owners contact data not found"
                    }
                );
            }

            if(petOwnerPhone){
                //To Do: send sms
            }

            if(petOwnerEmail){
                //To Do: send email
            }

            return res.status(200).json(
                {
                    error: false,
                    message: "Emergancy message succesfully send to pet owner"
                }
            );
        }catch(err){
            (error) => {
                console.log("ERROR: emergency", err);
                return res.status(500).json(
                    {
                        error: true,
                        message: "Internal server error"
                    }
                );
            }
        }
    }
);

export default router;