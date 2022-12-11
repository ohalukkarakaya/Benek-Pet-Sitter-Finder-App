import express from "express";
import Pet from "../../models/Pet.js";
import auth from "../../middleware/auth.js";
import { petImageCommentValidation } from "../../utils/bodyValidation/pets/petImageCommentValidationSchema.js";
import { petEditImageCommentValidation } from "../../utils/bodyValidation/pets/petEditImageCommentValidationSchema.js";

const router = express.Router();

//pet image leave comments and reply comment
router.put(
    "/petImageComment",
    auth,
    async (req, res) => {
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
    }
);

//edit comment and reply
router.put(
    "/petEditImageComment",
    auth,
    async (req, res) => {
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
    }
);

export default router;