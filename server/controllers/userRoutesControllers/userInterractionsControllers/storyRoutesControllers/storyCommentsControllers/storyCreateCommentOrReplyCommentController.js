import Story from "../../../../../models/Story.js";
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

export default storyCreateCommentOrReplyCommentController;