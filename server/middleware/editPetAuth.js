import Pet from "../models/Pet.js";

const editPetAuth = async (req, res, next) => {
    await Pet.findById(
        req.params.petId,
        (pet) => {
            if(!pet){
                return res.status(404).json(
                    {
                        error: true,
                        message: "Pet couldn't found"
                    }
                );
            }
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
        }
    );
};

export default editPetAuth;