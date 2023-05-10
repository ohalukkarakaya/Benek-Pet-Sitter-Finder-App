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
                petId = petInfo;
            }
        );

        delete searchedUser.password;
        delete searchedUser.iban;
        delete searchedUser.cardGuidies;
        delete searchedUser.trustedIps;
        delete searchedUser.blockedUsers;
        delete searchedUser.saved;
                
        searchedUser.dependedUsers.forEach(
            async ( dependedId ) => {
                const depended = await User.findById( dependedId );
                const dependedInfo = {
                    
                    userId: depended._id
                                    .toString(),
                    userProfileImg: depended.profileImg
                                            .imgUrl,
                    username: depended.userName,
                    userFullName: `${
                            depended.identity
                                    .firstName
                        } ${
                            depended.identity
                                    .middleName
                        } ${
                            depended.identity
                                    .lastName
                        }`.replaceAll( "  ", " ")
                }
                dependedId = dependedInfo;
            }
        );

        const starValues = searchedUser.stars.map( starObject => starObject.star );
        const totalStarValue = starValues.reduce(
            ( acc, curr ) =>
                    acc + curr, 0
        );
        const starCount = searchedUser.stasr.length;
        const starAvarage = totalStarValue / starCount;

        searchedUser.totalStar = starCount;
        searchedUser.stars = starAvarage;

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