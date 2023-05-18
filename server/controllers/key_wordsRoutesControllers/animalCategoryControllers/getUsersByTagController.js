import User from "../../../models/User.js";

const getUsersByTagController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const skip = parseInt( req.params.skip ) || 0;
        const limit = parseInt( req.params.limit ) || 15;

        const petId = req.body.petId;
        const speciesId = req.body.speciesId;

        if(
            !petId
            || !speciesId
        ){
            return res.status( 400 )
                      .json(
                        {
                            error: true,
                            message: "Missing Params"
                        }
                      );
        }

         const petTag = {
            petId: petId,
            speciesId: speciesId
        };

        const userQuery = {
            interestingPetTags: { $in: [ petTag ] } 
        };

        const users = await User.find( userQuery )
                                .skip( skip )
                                .limit( limit );

        const totalUserCount = await User.countDocuments( userQuery );

        return res.status( 200 )
                  .json(
                    {
                        error: false,
                        message: "User List Prepared Succesfully",
                        totalUserCount: totalUserCount,
                        users: users
                    }
                  );

    }catch( err ){
        console.log( "ERROR: getUsersByTagController - ", err );
        res.status( 500 )
           .json(
                {
                    error: true,
                    message: "Internal Server Error"
                }
            );
    }
}

export default getUsersByTagController;