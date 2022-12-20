import express from "express";
import User from "../../../../models/User.js";
import Event from "../../../../models/Event/Event.js";
import dotenv from "dotenv";
import auth from "../../../../middleware/auth.js";
import afterEventCommentEndpoints from "./afterEventCommentOperations.js";
import { uploadEventContent } from "../../../../middleware/contentHandle/serverHandleAfterEventContent.js";

dotenv.config();

const router = express.Router();

// upload content
router.post(
    "/:eventId",
    auth,
    uploadEventContent,
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

            let content;
            let isUrl;
            if(req.cdnUrl){
                isUrl = true
                content = req.cdnUrl;
            }else{
                content = req.body.content
            }

            if(!content){
                return res.status(400).json(
                    {
                        error: true,
                        message: "content is required"
                    }
                );
            }

            const meetingEvent = req.meetingEvent;

            meetingEvent.afterEvent.push(
                {
                    userId: req.user._id.toString(),
                    content: {
                        isUrl: isUrl,
                        value: content
                    },
                }
            );

            meetingEvent.markModified("afterEvent");
            meetingEvent.save(
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

            return res.status(200).json(
                {
                    error: false,
                    message: "content add succesfully"
                }
            );
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

// edit content
router.put(
    "/:eventId/:contentId",
    auth,
    uploadEventContent,
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

            const  content = req.content;
            if(req.cdnUrl){
                content.isUrl = true
                content.value = req.cdnUrl;
            }else{
                content.value = req.body.newContent
            }

            if(!content){
                return res.status(400).json(
                    {
                        error: true,
                        message: "content is required"
                    }
                );
            }

            const meetingEvent = req.meetingEvent;

            meetingEvent.markModified("afterEvent");
            meetingEvent.save(
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

            return res.status(200).json(
                {
                    error: false,
                    message: "content add succesfully"
                }
            );
        }catch(err){
            console.log("ERROR: edit after event interraction - ", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);

router.use("/comment", afterEventCommentEndpoints);

//edit contents

//delete contents

export default router;