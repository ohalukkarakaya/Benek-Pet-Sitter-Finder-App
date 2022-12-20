import express from "express";
import User from "../../../../models/User.js";
import Event from "../../../../models/Event/Event.js";
import dotenv from "dotenv";
import auth from "../../../../middleware/auth.js";
import afterEventCommentEndpoints from "./afterEventCommentOperations.js";
import { uploadEventContent } from "../../../../middleware/contentHandle/serverHandleAfterEventContent.js";
import s3 from "../../../../utils/s3Service.js";

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

// delete content
router.delete(
    "/:eventId/:contentId",
    auth,
    async (req, res) => {
        try{
            const eventId = req.params.eventId;
            const contentId = req.params.contentId;
            if(!eventId || !contentId){
                return res.status(400).json(
                    {
                        error: true,
                        message: "missing params"
                    }
                );
            }

            const meetingEvent = await Event.findById(eventId);
            if(!meetingEvent){
                return res.status(404).json(
                    {
                        error: true,
                        message: "Meeting event not found"
                    }
                );
            }

            const content = meetingEvent.afterEvent.find(
                contentObject =>
                    contentObject._id.toString() === contentId
            );
            if(!content){
                return res.status(404).json(
                    {
                        error: true,
                        message: "content not found"
                    }
                );
            }

            if(
                req.user._id.toString() !== content.userId.toString()
                && req.user._id.toString() !== meetingEvent.eventAdmin.toString()
            ){
                return res.status(401).json(
                    {
                        error: true,
                        message: "you are not authorized to edit this post"
                    }
                );
            }

            const areThereImgOnServer = content.content.isUrl;

            if(areThereImgOnServer){
                const splitedUrl = content.content.value.split("/");
                imgName = splitedUrl[splitedUrl.length - 1];

                const deleteImg = async (deleteParams) => {
                    try {
                        s3.deleteObject(deleteParams).promise();
                        console.log("Success", data);
                        return data;
                    } catch (err) {
                        console.log("Error", err);
                    }
                  };

                  const deleteContentImageParams = {
                    Bucket: process.env.BUCKET_NAME,
                    Key: `events/${req.eventId.toString()}/afterEventContents/${imgName}`
                };

                await deleteImg(deleteContentImageParams);
            }

            meetingEvent.afterEvent = meetingEvent.afterEvent.filter(
                contentObject =>
                    contentObject._id.toString() !== contentId
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

//like or remove like after event content
router.put(
    "/like/:eventId/:contentId",
    auth,
    async (req, res) => {
        
    }
);

router.use("/comment", afterEventCommentEndpoints);

//edit contents

//delete contents

export default router;