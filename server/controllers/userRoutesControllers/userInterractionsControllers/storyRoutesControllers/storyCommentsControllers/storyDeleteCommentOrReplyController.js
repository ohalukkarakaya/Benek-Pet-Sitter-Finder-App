import Story from "../../../../../models/Story.js";
import dotenv from "dotenv";

dotenv.config();

const storyDeleteCommentOrReplyController = async (req, res) => {
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
            comment.replies = comment.replies
                                     .filter(
                                            replyObject => 
                                                replyObject._id
                                                           .toString() !== req.body
                                                                              .replyId
                                      );
        }else{
            story.comments = story.comments
                                  .filter(
                                        commentObject => 
                                            commentObject._id
                                                         .toString() !== commentId
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
                message: "comment or reply deleted succesfully"
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

export default storyDeleteCommentOrReplyController;