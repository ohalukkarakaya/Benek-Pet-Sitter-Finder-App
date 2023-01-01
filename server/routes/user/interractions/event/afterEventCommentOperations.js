import express from "express";
import User from "../../../../models/User.js";
import Event from "../../../../models/Event/Event.js";
import dotenv from "dotenv";
import auth from "../../../../middleware/auth.js";

dotenv.config();

const router = express.Router();

//leave comment or reply comment of content
router.put(
    "/:eventId/:contentId",
    auth,
    async (req, res) => {
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
);

//edit comment or reply
router.put(
    "/edit/:eventId/:contentId",
    auth,
    async (req, res) => {
        try{
            const eventId = req.params.eventId;
            const contentId = req.params.contentId;
            const commentId = req.body.commentId;
            const newComment = req.body.desc;
            if(!eventId || !contentId || !newComment){
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
                    afterEventObject._id.toString() === contentId
            );
            if(!content){
                return res.status(404).json(
                    {
                        error: true,
                        message: "after event content not found"
                    }
                );
            }

            const comment = content.comments.find(
                commentObject =>
                    commentObject._id.toString() === commentId
            );
            if(!comment){
                return res.status(404).json(
                    {
                        error: true,
                        message: "comment not found"
                    }
                );
            }

            const isReply = req.body.replyId;

            if(isReply){
                const reply = comment.replies.find(
                    replyObject =>
                        replyObject.userId.toString() === req.body.replyId.toString()
                );

                if(
                    meetingEvent.eventAdmin.toString() !== req.user._id.toString()
                    && comment.userId.toString() !== req.user._id.toString()
                    && reply.userId.toString() !== req.user._id.toString()
                ){
                    return res.status(401).json(
                        {
                            error: true,
                            message: "You can not edit this reply object"
                        }
                    );
                }
                
                reply.reply = newComment;
            }else{
                if(
                    meetingEvent.eventAdmin.toString() !== req.user._id.toString()
                    && comment.userId.toString() !== req.user._id.toString()
                ){
                    return res.status(401).json(
                        {
                            error: true,
                            message: "You can not edit this comment object"
                        }
                    );
                }

                comment.comment = newComment;
            }

            meetingEvent.markModified("afterEvent");
            meetingEvent.save(
                (error) => {
                    if(error){
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
                    message: "comment or reply edited succesfully"
                }
            );
        }catch(err){
            console.log("ERROR: after event delete comment - ", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);

//delete comment or reply
router.delete(
    "/:eventId/:contentId",
    auth,
    async (req, res) => {
        try{
            const eventId = req.params.eventId;
            const contentId = req.params.contentId;
            const commentId = req.body.commentId;
            if(!eventId || !contentId){
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
                    afterEventObject._id.toString() === contentId
            );
            if(!content){
                return res.status(404).json(
                    {
                        error: true,
                        message: "after event content not found"
                    }
                );
            }

            const comment = content.comments.find(
                commentObject =>
                    commentObject._id.toString() === commentId
            );
            if(!comment){
                return res.status(404).json(
                    {
                        error: true,
                        message: "comment not found"
                    }
                );
            }

            const isReply = req.body.replyId;

            if(isReply){
                const reply = comment.replies.find(
                    replyObject =>
                        replyObject.userId.toString() === req.body.replyId.toString()
                );

                if(
                    meetingEvent.eventAdmin.toString() !== req.user._id.toString()
                    && comment.userId.toString() !== req.user._id.toString()
                    && reply.userId.toString() !== req.user._id.toString()
                ){
                    return res.status(401).json(
                        {
                            error: true,
                            message: "You can not edit this reply object"
                        }
                    );
                }
                
                comment.replies = comment.replies.filter(
                    replyObject =>
                        replyObject._id.toString() !== req.body.replyId.toString()
                );
            }else{
                if(
                    meetingEvent.eventAdmin.toString() !== req.user._id.toString()
                    && comment.userId.toString() !== req.user._id.toString()
                ){
                    return res.status(401).json(
                        {
                            error: true,
                            message: "You can not edit this comment object"
                        }
                    );
                }

                content.comments = content.comments.filter(
                    commentObject =>
                        commentObject._id.toString() !== commentId
                );
            }

            meetingEvent.markModified("afterEvent");
            meetingEvent.save(
                (error) => {
                    if(error){
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
                    message: "comment or reply edited succesfully"
                }
            );
        }catch(err){
            console.log("ERROR: after event delete comment - ", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);

//like comment
router.put(
    "/like/:eventId/:contentId/:commentId",
    auth,
    async (req, res) => {
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
);

export default router;