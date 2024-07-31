import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";

import getLightWeightPetInfoHelper from "../../../utils/getLightWeightPetInfoHelper.js";

const getRecommendedPetsController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        let petInfoList = [];

        const user = await User.findById( userId );

        for( let petId of user.pets ){
            const pet = await Pet.findById( petId.toString() );
            const petInfo = await getLightWeightPetInfoHelper( pet );

            petInfoList.push( petInfo );
        }

        for( let careGiveRecord of user.caregiverCareer ){
            const pet = await Pet.findById( careGiveRecord.pet.toString() );
            const petInfo = await getLightWeightPetInfoHelper( pet );

            petInfoList.push( petInfo );
        }

        // remove duplicate pets
        petInfoList = petInfoList.filter(( pet, index, self ) =>
            index === self.findIndex(( t ) => (
                t.id === pet.id
            ))
        );

        return res.status( 200 ).json({
            error: false,
            message: "recommended pets info prepared successfully",
            pets: petInfoList
        });

    }catch( err ){
        console.log("ERROR: getRecommendedPetsController - ", err);
        return res.status( 500 ).json({
            error: true,
            message: "Internal Server Error"
        });
    }
}

export default getRecommendedPetsController;