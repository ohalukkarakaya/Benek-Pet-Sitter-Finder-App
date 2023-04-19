import Event from "../../../models/Event/Event.js";
import dotenv from "dotenv";

dotenv.config();

const afterEventLikeCommentOrReplyController = async (req, res) => {
    try{
        const eventId = req.params.eventId;
        const contentId = req.params.contentId;
        const commentId = req.params.commentId;

        const replyId = req.body.replyId;
        const isReply = replyId;
        const userId = req.user._id.toString();

        if(
            !eventId
            || !contentId
            || !commentId
        ){
            return res.status(400).json(
                {
                    error: true,
                    message: "Missing params"
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
        
        const comment = content.comments.find(
            commentObject =>
                commentObject._id.toString() === commentId.toString()
        );
        if(!comment){
            return re.status(404).json(
                {
                    error: true,
                    message: "comment not found"
                }
            );
        }

        if(isReply){
            const reply = comment.replies.find(
                replyObject =>
                    replyObject._id.toString() === replyId.toString()
            );
            if(!reply){
                return res.status(404).json(
                    {
                        error: true,
                        message: "reply not found"
                    }
                );
            }

            const isAlreadyLiked = reply.likes.find(
                likedUserId =>
                    likedUserId.toString() === userId
            );
            if(isAlreadyLiked){
                reply.likes = reply.likes.filter(
                    likedUser =>
                        likedUser.toString() !== userId
                );
            }else{
                reply.likes.push(userId);
            }
        }else{
            const isAlreadyLiked = comment.likes.find(
                likedUserId =>
                    likedUserId.toString() === userId
            );

            if(isAlreadyLiked){
                comment.likes = comment.likes.filter(
                    likedUser =>
                        likedUser.toString() !== userId
                );
            }else{
                comment.likes.push(userId);
            }
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
                message: "comment or reply liked or like removed succesfully"
            }
        );
    }catch(err){
        console.log("ERROR: after event like comment - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default afterEventLikeCommentOrReplyController;