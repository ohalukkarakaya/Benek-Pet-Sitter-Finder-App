import Pet from "../models/Pet.js";
import User from "../models/User.js";

const editPetAuth = async (req, res, next) => {
    const pet =  await Pet.findById( req.params.petId ).clone();
    if(!pet){
        return res.status(404).json(
            {
                error: true,
                message: "Pet couldn't found"
            }
        );
    }
    const petOwner = await User.findById(pet.primaryOwner.toString());
    if(!petOwner || petOwner.deactivation.isDeactive){
        return res.status(404).json(
            {
                error: true,
                message: "Pet not found"
            }
        );
    }
    petOwner.done();

    if(pet.primaryOwner !== req.user._id){
        return res.status(403).json(
            {
                error: true,
                message: "You can't edit this pet"
            }
        );
    }
    req.pet = pet;
    next();
};

export default editPetAuth;