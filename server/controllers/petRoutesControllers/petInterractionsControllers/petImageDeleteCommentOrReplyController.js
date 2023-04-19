import Pet from "../../../models/Pet.js";
import { petDeleteImageCommentValidation } from "../../../utils/bodyValidation/pets/petImageCommentsValidationSchemas.js";

const petImageDeleteCommentOrReplyController = async (req, res) => {
    try{
        const { error } = petDeleteImageCommentValidation( req.body );
        if(error)
            return res.status(400).json(
                {
                    error: true,
                    message: error.details[0].message
                }
            );
    
        const isReply = req.body.replyId !== undefined && req.body.replyId !== null;

        const pet = await Pet.findById( req.body.petId );

        if(!pet){
            console.log("pet couldn't found");
            return res.status(404).json(
                {
                    error: true,
                    message: "Pet couldn't founs"
                }
            );
        }
            
        const image = pet.images.find(
            image =>
                image._id.toString() === req.body.imgId.toString()
        );
            
        if(image){
            if(isReply){
                const comments = image.comments.find(
                    comment =>
                        comment._id.toString() === req.body.commentId.toString()
                );

                const replyObject = comments.replies.find(
                    replyObject =>
                        replyObject._id.toString() === req.body.replyId.toString()
                );

                if(
                    replyObject.userId.toString() !== req.user._id.toString()
                    && comments.userId.toString() !== req.user._id.toString()
                    && pet.primaryOwner.toString() !== req.ıser._id.toString()
                ){
                    return res.status(401).json(
                        {
                            error: true,
                            message: "You can't edit this comment"
                        }
                    );
                }

                comments.replies = comments.replies.filter(
                    replyObject => 
                        replyObject._id.toString() !== req.body.replyId.toString()
                );
            }else{
                const commentObject = image.comments.find(
                    comment =>
                        comment._id.toString() === req.body.commentId.toString()
                );

                if(
                    commentObject.userId.toString() !== req.user._id.toString()
                    && pet.primaryOwner.toString() !== req.ıser._id.toString()
                ){
                    return res.status(401).json(
                        {
                            error: true,
                            message: "You can't edit this comment"
                        }
                    );
                }

                image.comments = image.comments.filter(
                    commentObject =>
                        commentObject._id.toString() !== req.body.commentId.toString()
                );
            }

            pet.markModified("images");
            pet.save(
                (err) => {
                    if(err) {
                        console.error('ERROR: While Deleting Comment!');
                        return res. status(500).json(
                            {
                                error: true,
                                message: "ERROR: While Deleting Comment!"
                            }
                        );
                    }
                }
            );

            return res.status(200).json(
                {
                    error: false,
                    message: "Comment deleted succesfully"
                }
            );
        }else{
            return res.status(404).json(
                {
                    error: true,
                    message: "image couldn't found"
                }
            );
        }
    }catch(err){
        console.log("error - delete", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default petImageDeleteCommentOrReplyController;