import express from "express";
import User from "../../../../models/User.js";
import Event from "../../../../models/Event/Event.js";
import dotenv from "dotenv";
import auth from "../../../../middleware/auth.js";
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
            if(req.cdnUrl){
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
                    content: content,
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

//leave comment or reply comment of content
router.put(
    "/comment/:eventId/:contentId",
    auth,
    async (req, res) => {
        try{
            const eventId = req.params.eventId;
            const contentId = req.params.contentId;
            if(!eventId || contentId){
                return res.status(400).json(
                    {
                        error: true,
                        message: "Missing params"
                    }
                );
            }

            const meetingEvent = await Event.findById(eventId);
            if(!meetingEvent){
                return res.status(404).json(
                    {
                        error: true,
                        message: "Event not found"
                    }
                );
            }

            const content = meetingEvent.afterEvent.find(
                afterEventObject =>
                    afterEventObject._id.toString() === contentId.toString()
            );
            if(!content){
                return res.status(404).json(
                    {
                        error: true,
                        message: "content not found"
                    }
                );
            }

            const isReply = req.body.commentId;

            if(isReply){
                const comment = content.comments.find(
                    commentObject =>
                        commentObject._id.toString() === req.body.commentId.toString()
                );
                if(!comment){
                    return res.status(404).json(
                        {
                            error: true,
                            message: "Comment not found"
                        }
                    );
                }

                comment.replies.push(
                    {
                        userId: req.user._id.toString(),
                        reply: req.body.desc
                    }
                );
            }else{
                content.comments.push(
                    {
                        userId: req.user._id.toString(),
                        comment: req.body.desc,
                    }
                );
            }

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
            console.log("ERROR: after event comment - ", err);
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