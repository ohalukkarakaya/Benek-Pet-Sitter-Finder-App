import Event from "../../../../../models/Event/Event.js";
import dotenv from "dotenv";

dotenv.config();

const afterEventCreateCommentOrReplyCommentController = async (req, res) => {
    try{
        const eventId = req.params.eventId;
        const contentId = req.params.contentId;
        const commentContent = req.body.desc;
        if(!eventId || contentId || !commentContent){
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
                    reply: commentContent
                }
            );
        }else{
            content.comments.push(
                {
                    userId: req.user._id.toString(),
                    comment: commentContent,
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

export default afterEventCreateCommentOrReplyCommentController;