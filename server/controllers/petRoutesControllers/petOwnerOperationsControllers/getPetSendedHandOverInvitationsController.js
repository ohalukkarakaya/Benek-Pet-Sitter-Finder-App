import Pet from "../../../models/Pet.js";
import User from "../../../models/User.js";
import PetHandOverInvitation from "../../../models/ownerOperations/PetHandOverInvitation.js";

const getPetSendedHandOverInvitationsController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const skip = parseInt( req.params.skip ) || 0;
        const limit = parseInt( req.params.limit ) || 15;

        invitationQuery = { from: userId };
        const invitations = await PetHandOverInvitation.find( invitationQuery );

        const totalInvitationCount = await PetHandOverInvitation.countDocuments( invitationQuery );
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
                const secondaryOwner = await User.findById( 
                                                    invitation.to
                                                              .toString() 
                                                );

                const secondaryOwnerInfo = {

                    userId: secondaryOwner._id
                                          .toString(),
    
                    userProfileImg: secondaryOwner.profileImg
                                                  .imgUrl,
    
                    username: secondaryOwner.userName,
    
                    userFullName: `${
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

                invitation.to = secondaryOwnerInfo;

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
                message: "Sended Invitation List Prepared Succesfully",
                totalInvitationCount: totalInvitationCount,
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

export default getPetSendedHandOverInvitationsController;