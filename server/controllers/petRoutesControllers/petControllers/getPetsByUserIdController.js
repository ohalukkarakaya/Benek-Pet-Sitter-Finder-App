import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";

const getPetsByUserIdController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const searchedUserId = req.params.userId.toString();

        let petInfoList;

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
                    petName: pet.name,
                    sex: pet.sex,
                    birthDay: pet.birthDay,
                    kind: pet.kind,
                    species: pet.species,
                    handoverCount: pet.handOverRecord.length
                }
                petInfoList.push( petInfo );
            }
        );

        if( searchedUser.pets.length === petInfoList.length ){
            return res.status( 200 ).json(
                {
                    error: false,
                    message: "Pet list prepared succesfully",
                    pets: petInfoList
                }
            );
        }
    }catch( err ){
        console.log("ERROR: getPetsByUserIdController - ", err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default getPetsByUserIdController;