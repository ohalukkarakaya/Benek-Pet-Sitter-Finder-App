import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";

import getLightWeightPetInfoHelper from "../../../utils/getLightWeightPetInfoHelper.js";

const getPetsByJwtController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        let petInfoList;

        const user = await User.findById( userId );


        user.pets.forEach(
            async ( petId ) => {
                const pet = await Pet.findById( petId.toString() );
                const petInfo = getLightWeightPetInfoHelper( pet );
                petInfoList.push( petInfo );
            }
        );

        if( petInfoList.length === user.pets.length ){
            return res.status( 200 ).json(
                {
                    error: false,
                    message: "pet info prepared succesfully",
                    pets: petInfoList
                }
            );
        }
    }catch( err ){
        console.log("ERROR: getPetsByJwtController - ", err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default getPetsByJwtController;