import Pet from "../../../models/Pet.js";
import { petImageLikeValidation } from "../../../utils/bodyValidation/pets/petImageLikeValidationSchemas.js";

const petLikeImageOrRemoveLikeController = async (req, res) => {
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
                imageObject._id.toString() === req.body.imgId.toString()
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
                message: "image has been liked or like has been removed"
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

export default petLikeImageOrRemoveLikeController;