import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";

import getLightWeightPetInfoHelper from "../../../utils/getLightWeightPetInfoHelper.js";

const getPetByIdController = async ( req, res ) => {
    try{
        const petId = req.params.petId.toString();
        if( !petId ){
            return res.status( 400 ).json({
                error: true,
                message: "Missing Params"
            });
        }

        let pet = await Pet.findById( petId ).lean();

        const owner = await User.findById( pet.primaryOwner.toString() );

        if( 
            !pet
            || !owner
            || owner.deactivation.isDeactive
            || owner.blockedUsers.includes( req.user._id.toString() )
        ){
            return res.status( 404 ).json({
                error: true,
                message: "Pet not found"
            });
        }

        pet = await getLightWeightPetInfoHelper( pet );

        return res.status( 200 ).json({
            error: false,
            message: "Pet found succesfully",
            pet: pet
        });

    }catch( err ){
        console.log("ERROR: getPetByIdController - ", err);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
}

export default getPetByIdController;