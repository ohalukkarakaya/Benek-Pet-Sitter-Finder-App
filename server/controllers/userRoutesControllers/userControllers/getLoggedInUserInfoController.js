import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";

const getLoggedInUserInfoController = async ( req, res ) => {
    try{
        const userId = req.user_id.toString();

        const user = await User.findById( userId );
        if( !user ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "User Not Found"
                }
            );
        }
        user.pets.forEach(
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

        delete user.password;
        delete user.iban;
        delete user.cardGuidies;
        delete user.trustedIps;
        delete user.blockedUsers;
        delete user.saved;
        delete item.identity.nationalId;
                
        user.dependedUsers.forEach(
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

        const starValues = user.stars.map( starObject => starObject.star );
        const totalStarValue = starValues.reduce(
            ( acc, curr ) =>
                    acc + curr, 0
        );
        const starCount = user.stasr.length;
        const starAvarage = totalStarValue / starCount;

        user.totalStar = starCount;
        user.stars = starAvarage;

        return res.status( 200 ).json(
            {
                error: false,
                message: "User Info Prepared Succesfuly",
                user: user
            }
        );
    }catch( err ){
        console.log("ERROR: getLoggedInUserInfoController - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default getLoggedInUserInfoController;