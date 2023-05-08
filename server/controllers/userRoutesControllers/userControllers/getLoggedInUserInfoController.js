import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";

const getLoggedInUserInfoController = async ( req, res ) => {
    try{
        const userId = req.user_id.toString();

        const user = await User.findById( userId );
        user.pets.forEach(
            async ( petId ) => {
                const pet = await Pet.findById( petId.toString() );
                const petInfo = {
                    petId: petId.toString(),
                    petProfileImgUrl: pet.petProfileImg.imgUrl,
                    petName: pet.name
                }
                user.petList.push( petInfo );
            }
        );

        if( user.petList.length === user.pets.length ){
            delete user.pets;
        }

        if( !user ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "User Not Found"
                }
            );
        }

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