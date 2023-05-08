import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";

const getPetByIdController = async ( req, res ) => {
    try{
        const petId = req.params.petId.toString();
        if( !petId ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "Missing Params"
                }
            );
        }

        const pet = await Pet.findById( petId );
        const owner = await User.findById( pet.primaryOwner.toString() );
        if( 
            !pet
            || !owner
            || owner.deactivation.isDeactive
            || owner.blockedUsers.includes( req.user._id.toString() )
        ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "Pet not found"
                }
            );
        }

        const primaryOwnerInfo = {
            userId: owner._id.toString(),
            userProfileImg: owner.profileImg.imgUrl,
            username: owner.userName,
            usersFullName: `${
                    owner.identity
                         .firstName
                } ${
                    owner.identity
                         .middleName
                } ${
                    owner.identity
                         .lastName
                }`.replaceAll( "  ", " ")
        }

        pet.primaryOwner = primaryOwnerInfo;

        pet.allOwners.forEach(
            async( ownerId ) => {
                const secondaryOwner = await User.findById( ownerId.toString() );
                const secondaryOwnerInfo = {
                    userId: secondaryOwner._id.toString(),
                    userProfileImg: secondaryOwner.profileImg.imgUrl,
                    username: secondaryOwner.userName,
                    usersFullName: `${
                            secondaryOwner.identity
                                          .firstName
                        } ${
                            secondaryOwner.identity
                                          .middleName
                        } ${
                            secondaryOwner.identity
                                          .lastName
                        }`.replaceAll( "  ", " ")
                }
                pet.allOwnerInfoList.push( secondaryOwnerInfo );
            }
        );

        if( pet.allOwnerInfoList.length === pet.allOwners.length ){
            delete pet.allOwners
        }

        return res.status( 200 ).json(
            {
                error: false,
                message: "Pet found succesfully",
                pet: pet
            }
        );

    }catch( err ){
        console.log("ERROR: getPetByIdController - ", err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default getPetByIdController;