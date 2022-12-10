import express from "express";
import Pet from "../../models/Pet.js";
import auth from "../../middleware/auth.js";
import { petImageCommentValidation } from "../../utils/bodyValidation/pets/petImageCommentValidationSchema.js";

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

        await Pet.findById(
            req.body.petId,
            (err, pet) => {
                if(err){
                    console.log("error", err);
                    return res.status(500).json(
                        {
                            error: true,
                            message: "An error occured while searching pet"
                        }
                    );
                }

                if(!pet){
                    console.log("pet couldn't found");
                    return res.status(404).json(
                        {
                            error: true,
                            message: "Pet couldn't founs"
                        }
                    );
                }
                
                const image = pet.images.filter(
                    image =>
                        image.imgUrl === req.body.imgUrl
                )[0];

                if(isReply){
                    image.comment.replies.push(
                        {
                            userId: req.user._id,
                            reply: req.body.comment
                        }
                    );
                }else{
                    image.comment.push(
                        {
                            userId: req.user._id,
                            comment: req.body.comment
                        }
                    );
                }

                pet.markDown("images");
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
            }
        );
    }
);

export default router;