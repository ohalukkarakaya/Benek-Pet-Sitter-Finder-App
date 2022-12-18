import express from "express";
import User from "../../../../models/User.js";
import Event from "../../../../models/Event/Event.js";
import EventTicket from "../../../../models/Event/EventTicket.js";
import EventInvitation from "../../../../models/Event/Invitations/InviteEvent.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import auth from "../../../../middleware/auth.js";
import QRCode from "qrcode";

dotenv.config();

const router = express.Router();

// upload content or comment after event
router.post(
    "/:eventId",
    auth,
    async (req, res) => {
        try{
            const eventId = req.params.eventId;
            if(!eventId){
                return res.status(400).json(
                    {
                        error: true,
                        message: "eventId is required"
                    }
                );
            }

            const content = req.body.content;
            if(!content){
                return res.status(400).json(
                    {
                        error: true,
                        message: "content is required"
                    }
                );
            }

            const meetingEvent = await Event.findById(eventId);
            if(!meetingEvent){
                return res.status(400).json(
                    {
                        error: true,
                        message: "event not found"
                    }
                );
            }


        }catch(err){
            console.log("ERROR: after event interraction - ", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);
//edit contents

//delete contents

export default router;