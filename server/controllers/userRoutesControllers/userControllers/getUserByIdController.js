import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";

const getUserByIdController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const searchedUserId = req.params.userId.toString();
        if( !searchedUserId ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "Missing Params"
                }
            );
        }

        const searchedUser = await User.findById( searchedUserId );
        if( 
            !searchedUser 
            || searchedUser.deactivation.isDeactive
            || searchedUser.blockedUsers.includes( userId )
        ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "User Not Found"
                }
            );
        }

        searchedUser.pets.forEach(
            async ( petId ) => {
                const pet = await Pet.findById( petId.toString() );
                const petInfo = {
                    petId: petId.toString(),
                    petProfileImgUrl: pet.petProfileImg.imgUrl,
                    petName: pet.name
                }
                searchedUser.petList.push( petInfo );
            }
        );

        if( searchedUser.petList.length === searchedUser.pets.length ){
            delete searchedUser.pets;
        }

        return res.status( 200 ).json(
            {
                error: false,
                message: "User Info Prepared Succesfully",
                user: searchedUser
            }
        );
    }catch( err ){
        console.log("ERROR: getUserByIdController - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default getUserByIdController;