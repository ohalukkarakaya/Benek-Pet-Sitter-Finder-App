import express from "express";
import User from "../../models/User.js";
import Story from "../../../models/Story.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

//story leave comment or reply comment
router.post(
    "/:storyId",
    auth,
    async (req, res) => {
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
            }else{
                story.comments.push(
                    {
                        userId: req.user._id.toString(),
                        comment: commentDesc
                    }
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
);

//story edit comment or reply
router.put(
    "/:storyId",
    auth,
    async (req, res) => {
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

            const commentId = req.body.commentId;
            if(!commentId){
                return res.status(400).json(
                    {
                        error: true,
                        message: "commentId is required"
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

            const comment = story.comments.find(
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
                    replyObject => replyObject._id === req.body.replyId
                );
                if(!reply){
                    return res.status(404).json(
                        {
                            error: true,
                            message: "reply not found"
                        }
                    );
                }

                reply.reply = commentDesc;
            }else{
                comment.comment = commentDesc;
            }

            story.markModified("comments");
            story.save(
                (err) => {
                    if(err){
                      console.log("error", err);
                      return res.status(500).json(
                        {
                          error: true,
                          message: "An error occured while deleting comment"
                        }
                      );
                    }
                  }
            );

            return res.status(200).json(
                {
                    error: false,
                    message: "comment or reply inserted succesfully"
                }
            );
        }catch(err){
            console.log("ERROR: story delete comment - ", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);

//story delete comment or reply
router.delete(
    "/:storyId",
    auth,
    async (req, res) => {
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

            const commentId = req.body.commentId;
            if(!commentId){
                return res.status(400).json(
                    {
                        error: true,
                        message: "commentId is required"
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

            const comment = story.comments.find(
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
                comment.replies.filter(
                    replyObject => replyObject._id !== req.body.replyId
                );
            }else{
                story.comments.filter(
                    commentObject => commentObject._id !== commentId
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
                          message: "An error occured while deleting comment"
                        }
                      );
                    }
                  }
            );

            return res.status(200).json(
                {
                    error: false,
                    message: "comment or reply inserted succesfully"
                }
            );
        }catch(err){
            console.log("ERROR: story delete comment - ", err);
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