import Story from "../../../../../models/Story.js";

import sendNotification from "../../../../../utils/notification/sendNotification.js";
import dotenv from "dotenv";

dotenv.config();

const storyCreateCommentOrReplyCommentController = async (req, res) => {
    try{
        const storyId = req.params.storyId;
        if(!storyId){
            return res.status(400).json(
                {
                    error: true,
                    message: "storyId is required"
                }
            );
        }

        const commentDesc = req.body.desc;
        if(!commentDesc){
            return res.status(400).json(
                {
                    error: true,
                    message: "desc is required"
                }
            );
        }

        const story = await Story.findById(storyId.toString());
        if(!story){
            return res.status(404).json(
                {
                    error: true,
                    message: "Story couldn't found"
                }
            );
        }

        let commentId;
        let replyId;

        const isReply = req.body.commentId;
        if(isReply){
            const comment = story.comments.find(
                commentObject =>
                    commentObject._id.toString() === req.body.commentId
            );
            if(!comment){
                return res.status(404).json(
                    {
                        error: true,
                        message: "comment not found" 
                    }
                );
            }

            comment.replies.push(
                {
                    userId: req.user._id.toString(),
                    reply: commentDesc
                }
            );

            const insertedReply = comment.replies
                                         .find(
                                            reply =>
                                                reply.userId === req.user._id.toString()
                                                && reply.reply === commentDesc
                                         );

            replyId = insertedReply._id.toString();

            await sendNotification(
                req.user._id.toString(),
                comment.userId.toString(),
                "storyReply",
                insertedReply._id.toString(),
                "storyComment",
                req.body.commentId.toString(),
                "story",
                storyId.toString(),
                null,
                null
            );
        }else{
            story.comments.push(
                {
                    userId: req.user._id.toString(),
                    comment: commentDesc
                }
            );

            const insertedComment = story.comments.find(
                comment =>
                    comment.userId === req.user._id.toString()
                    && comment.comment === commentDesc
            );

            commentId = insertedComment._id.toString();

            await sendNotification(
                req.user._id.toString(),
                story.userId.toString(),
                "storyComment",
                insertedComment._id.toString(),
                "story",
                storyId.toString(),
                null,
                null,
                null,
                null
            );
        }

        story.markModified("comments");
        story.save(
            (err) => {
                if(err){
                  console.log("error", err);
                  return res.status(500).json(
                    {
                      error: true,
                      message: "An error occured while saving to database"
                    }
                  );
                }
              }
        );

        return res.status(200).json(
            {
                error: false,
                commentId: commentId,
                replyId: replyId,
                message: "comment or reply inserted succesfully"
            }
        );
    }catch(err){
        console.log("ERROR: comment story - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default storyCreateCommentOrReplyCommentController;