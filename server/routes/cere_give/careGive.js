import express from "express";
import User from "../../../../models/User.js";
import CareGive from "../../../../models/Event/Event.js";
import EventTicket from "../../../../models/Event/EventTicket.js";
import dotenv from "dotenv";
import auth from "../../../../middleware/auth.js";
import { uploadEventImage } from "../../../../middleware/contentHandle/serverHandleEventImage.js";
import eventJoinEndpoints from "./eventJoin.js";
import afterEventEndpoints from "./eventGuestInterractions.js";
import organizerEndpoints from "./organizerOperations.js";
import s3 from "../../../../utils/s3Service.js";

dotenv.config();

const router = express.Router();

router.post(
    "/",
    auth,
    async (req, res) => {
        try{

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