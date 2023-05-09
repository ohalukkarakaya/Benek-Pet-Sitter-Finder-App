import Event from "../../../../../models/Event/Event.js";
import dotenv from "dotenv";

dotenv.config();

const afterEventContentLikeRemoveLikeController = async (req, res) => {
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
        if(!eventId){
            return res.status(404).json(
                {
                    error: true,
                    message: "event not found"
                }
            );
        }

        const content = meetingEvent.afterEvent.find(
            afterEventObject =>
                afterEventObject._id.toString() === contentId
        );
        if(!content){
            return res.status(404).json(
                {
                    error: true,
                    message: "content not found"
                }
            );
        }

        const isAlreadyLiked = content.likes.find(
            likedUser =>
                likedUser.toString() === req.user._id.toString()
        );

        if(isAlreadyLiked){
            content.likes = content.likes.filter(
                likedUser =>
                    likedUser !== req.user._id.toString()
            );
        }else{
            content.likes.push( req.user._id.toString() );
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
                message: "content lked or like removed succesfully"
            }
        );
    }catch(err){
        console.log("ERROR: like after event interraction - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default afterEventContentLikeRemoveLikeController;