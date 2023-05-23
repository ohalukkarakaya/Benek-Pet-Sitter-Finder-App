import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";
import getLightWeightUserInfoHelper from "../../../utils/getLightWeightUserInfoHelper.js";

const getLoggedInUserInfoController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();

        const user = await User.findById( userId ).lean();
        if( !user ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "User Not Found"
                }
            );
        }

        let petList = [];
        for(
            var petId
            of user.pets
        ){
            const pet = await Pet.findById( petId.toString() );
            const petInfo = {
                petId: petId.toString(),
                petProfileImgUrl: pet.petProfileImg.imgUrl,
                petName: pet.name
            }
            petList.push( petInfo );
        }

        user.pets = petList;

        delete user.password;
        delete user.iban;
        delete user.cardGuidies;
        delete user.trustedIps;
        delete user.updatedAt;
        
        let dependedUserList = [];
        for(
            var dependedId
            of user.dependedUsers
        ){
            const depended = await User.findById( dependedId );
            const dependedInfo = getLightWeightUserInfoHelper( depended );
                
            dependedUserList.push( dependedInfo );
        }

        user.dependedUsers = dependedUserList;

        const starValues = user.stars.map( starObject => starObject.star );
        const totalStarValue = starValues.reduce(
            ( acc, curr ) =>
                    acc + curr, 0
        );
        const starCount = user.stars.length;
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