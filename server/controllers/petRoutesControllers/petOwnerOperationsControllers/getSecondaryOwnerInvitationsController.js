import Pet from "../../../models/Pet.js";
import User from "../../../models/User.js";
import SecondaryOwnerInvitation from "../../../models/ownerOperations/SecondaryOwnerInvitation.js";

const getSecondaryOwnerInvitationsController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();

        const invitations = await SecondaryOwnerInvitation.find(
            {
                to: userId
            }
        );

        if( invitations.length <= 0 ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "No Invitation Found"
                }
            );
        }

        invitations.forEach(
            async ( invitation ) => {
                const primaryOwner = await User.findById( 
                                                    invitation.from
                                                              .toString() 
                                                );

                const primaryOwnerInfo = {

                    userId: primaryOwner._id
                                        .toString(),
    
                    userProfileImg: primaryOwner.profileImg
                                                .imgUrl,
    
                    username: primaryOwner.userName,
    
                    userFullName: `${
                            primaryOwner.identity
                                        .firstName
                        } ${
                            primaryOwner.identity
                                        .middleName
                        } ${
                            primaryOwner.identity
                                        .lastName
                        }`.replaceAll( "  ", " ")
                }

                invitation.from = primaryOwnerInfo;
                delete invitation.from;

                const pet = await Pet.findById( invitation.petId.toString() );

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

                invitation.pet = petInfo;
                delete invitation.petId;
            }
        );

        return res.status( 200 ).json(
            {
                error: true,
                message: "Releated Invitation List Prepared Succesfully",
                invitations: invitations
            }
        );
    }catch( err ){
        console.log("ERROR: getSecondaryOwnerInvitationsController - ", err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default getSecondaryOwnerInvitationsController;