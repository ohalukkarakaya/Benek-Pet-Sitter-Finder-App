import Pet from "../../../models/Pet.js";
import { petImageCommentLikeValidation } from "../../../utils/bodyValidation/pets/petImageLikeValidationSchemas.js";

const petLikeImageCommentController = async (req, res) => {
    try{
        const { error } = petImageCommentLikeValidation( req.body );
        if(error){
            return res.status(400).json( {
                error: true,
                message: error.details[0].message
            });
        }

        const pet = await Pet.findById( req.body.petId );
        if(!pet){
            return res.status(404).json({
                error: true,
                message: "Pet couldn't found"
            });
        }

        const image = pet.images.find(
            imageObject => 
                imageObject._id.toString() === req.body.imgId.toString()
        );

        if(!image){
            return res.status(404).json({
                error: true,
                message: "image couldn't found"
            });
        }

        const comment = image.comments.find(
            commentObject =>
                commentObject._id.toString() === req.body.commentId.toString()
        );

        if( !comment ){
            return res.status( 404 ).json({
                error: true,
                message: "Comment not found"
            });
        }

        const isReply = req.body.replyId !== undefined && req.body.replyId !== null;

        if(isReply){
            const reply = comment.replies.find(
                replyObject =>
                    replyObject._id.toString() === req.body.replyId.toString()
            );

            if( !reply ){
                return res.status( 404 ).json({
                    error: true,
                    message: "Reply Not Found"
                });
            }
            
            const isAlreadyLiked = reply.likes.find(
                likedUserId =>
                    likedUserId.toString() === req.user._id.toString()
            );

            if(isAlreadyLiked){
                reply.likes = reply.likes.filter(
                    likedUserId =>
                        likedUserId.toString() !== req.user._id.toString()
                );
            }else{
                reply.likes.push(
                    req.user._id.toString()
                );
            }
        }else{
            const isAlreadyLiked = comment.likes.find(
                likedUserId =>
                    likedUserId.toString() === req.user._id.toString()
            );

            if(isAlreadyLiked){
                comment.likes = image.likes.filter(
                    likedUserId =>
                        likedUserId.toString() !== req.user._id.toString()
                );
            }else{
                comment.likes.push( req.user._id.toString() );
            }
        }

        pet.markModified("images");
        pet.save(
            (err) => {
                if(err) {
                    console.error('ERROR: While Inserting Comment!');
                    return res. status(500).json({
                        error: true,
                        message: "ERROR: While Inserting Comment!"
                    });
                }
            }
        );

        return res.status(200).json({
            error: false,
            message: "comment or reply has been liked or like has been removed"
        });

    }catch(err){
        console.log("error - like comment", err);
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
}

export default petLikeImageCommentController;