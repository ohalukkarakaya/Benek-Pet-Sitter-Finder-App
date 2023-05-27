import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";

import getLightWeightPetInfoHelper from "../../../utils/getLightWeightPetInfoHelper.js";

const getPetsByUserIdController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const searchedUserId = req.params
                                  .userId
                                  .toString();

        let petInfoList = [];

        if( !searchedUserId ){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "Missing Params"
                            }
                      );
        }

        const searchedUser = await User.findById( searchedUserId );
        if(
            !searchedUser
            || searchedUser.deactivation
                           .isDeactive

            || searchedUser.blockedUsers
                           .includes( userId )
        ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "User Not Found"
                            }
                      );
        }

        for(
            let petId
            of searchedUser.pets
        ){
            const pet = await Pet.findById( 
                                    petId.toString() 
                                  );

            const petInfo = getLightWeightPetInfoHelper( pet );
            petInfoList.push( petInfo );
        }

        if( 
            searchedUser.pets
                        .length === petInfoList.length 
        ){
            return res.status( 200 )
                      .json(
                            {
                                error: false,
                                message: "Pet list prepared succesfully",
                                pets: petInfoList
                            }
                      );
        }
    }catch( err ){
        console.log( "ERROR: getPetsByUserIdController - ", err );
        res.status( 500 )
           .json(
                {
                    error: true,
                    message: "Internal Server Error"
                }
            );
    }
}

export default getPetsByUserIdController;