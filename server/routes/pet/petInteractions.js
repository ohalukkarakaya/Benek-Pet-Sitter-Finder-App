import express from "express";
import Pet from "../../models/Pet.js";
import auth from "../../middleware/auth.js";
import { petImageCommentValidation, petEditImageCommentValidation, petDeleteImageCommentValidation } from "../../utils/bodyValidation/pets/petImageCommentsValidationSchemas.js";

const router = express.Router();

//like image
router.put(
    "/likeImage",
    auth,
    async (req, res) => {
        try{
            const { error } = petImageLikeValidation( req.body );
            if(error){
                return res.status(400).json(
                    {
                        error: true,
                        message: error.details[0].message
                    }
                );
            }

            const pet = await Pet.findById( req.body.petId );
            if(!pet){
                return res.status(404).json(
                    {
                        error: true,
                        message: "Pet couldn't found"
                    }
                );
            }

            const image = pet.images.find(
                imageObject => 
                    imageObject._id.toString === req.body.imgId.toString()
            );
            if(!image){
                return res.status(404).json(
                    {
                        error: true,
                        message: "image couldn't found"
                    }
                );
            }

            const isAlreadyLiked = image.likes.find(
                likedUserId =>
                    likedUserId.toString() === req.user._id.toString()
            );

            if(isAlreadyLiked){
                image.likes = image.likes.filter(
                    likedUserId =>
                        likedUserId.toString() !== req.user._id.toString()
                );
            }else{
                image.likes.push( req.user._id.toString() );
            }

            pet.markModified("images");
            pet.save(
                (err) => {
                    if(err) {
                        console.error('ERROR: While Inserting Comment!');
                        return res. status(500).json(
                            {
                                error: true,
                                message: "ERROR: While Inserting Comment!"
                            }
                        );
                    }
                }
            );

            return res.status(200).json(
                {
                    error: false,
                    message: "image has been liked"
                }
            );
            
        }catch(err){
            console.log("error - like image", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);

//pet image leave comments and reply comment
router.put(
    "/petImageComment",
    auth,
    async (req, res) => {
        try{
            const { error } = petImageCommentValidation( req.body );
            if(error)
                return res.status(400).json(
                    {
                        error: true,
                        message: error.details[0].message
                    }
                );
        
            const isReply = req.body.commentId !== undefined && req.body.commentId !== null;

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
                    image.comments.find(
                        comment =>
                            comment._id.toString() === req.body.commentId.toString()
                    ).replies.push(
                        {
                            userId: req.user._id,
                            reply: req.body.comment
                        }
                    );
                }else{
                    image.comments.push(
                        {
                            userId: req.user._id,
                            comment: req.body.comment
                        }
                    );
                }
    
                pet.markModified("images");
                pet.save(
                    (err) => {
                        if(err) {
                            console.error('ERROR: While Inserting Comment!');
                            return res. status(500).json(
                                {
                                    error: true,
                                    message: "ERROR: While Inserting Comment!"
                                }
                            );
                        }
                    }
                );
    
                return res.status(200).json(
                    {
                        error: false,
                        message: "Comment saved succesfully"
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
            console.log("error", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);

//edit comment and reply
router.put(
    "/petEditImageComment",
    auth,
    async (req, res) => {
        try{
            const { error } = petEditImageCommentValidation( req.body );
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
                        message: "Pet couldn't found"
                    }
                );
            }
                
            const image = pet.images.find(
                image =>
                    image._id.toString() === req.body.imgId.toString()
            );
                
            if(image){
                if(isReply){
                    const replyObject = image.comments.find(
                        comment =>
                            comment._id.toString() === req.body.commentId.toString()
                    ).replies.find(
                        reply =>
                            reply._id.toString() === req.body.replyId.toString()
                    );

                    replyObject.reply = req.body.newComment;
                }else{
                    const commentObject = image.comments.find(
                        comment =>
                            comment._id.toString() === req.body.commentId.toString()
                    );

                    commentObject.comment = req.body.newComment;
                }
    
                pet.markModified("images");
                pet.save(
                    (err) => {
                        if(err) {
                            console.error('ERROR: While Editing Comment!');
                            return res. status(500).json(
                                {
                                    error: true,
                                    message: "ERROR: While Editing Comment!"
                                }
                            );
                        }
                    }
                );
    
                return res.status(200).json(
                    {
                        error: false,
                        message: "Comment edited succesfully"
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
            console.log("error - edit", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);

//delete pet image comment and replies
router.delete(
    "/petImageComment",
    auth,
    async (req, res) => {
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
                    comments.replies = comments.replies.filter(
                        replyObject => 
                            replyObject._id.toString() !== req.body.replyId.toString()
                    );
                }else{
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
);

export default router;