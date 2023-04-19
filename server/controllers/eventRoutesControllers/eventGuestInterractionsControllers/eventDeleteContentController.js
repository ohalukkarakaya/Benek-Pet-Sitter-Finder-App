import Event from "../../../models/Event/Event.js";
import s3 from "../../../utils/s3Service.js";
import dotenv from "dotenv";

dotenv.config();

const eventDeleteContentController = async (req, res) => {
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

export default eventDeleteContentController;