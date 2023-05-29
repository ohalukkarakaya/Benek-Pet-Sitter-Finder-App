import Pet from "../../../models/Pet.js";
import User from "../../../models/User.js";
import PetHandOverInvitation from "../../../models/ownerOperations/PetHandOverInvitation.js";
import getLightWeightPetInfoHelper from "../../../utils/getLightWeightPetInfoHelper.js";
import getLightWeightUserInfoHelper from "../../../utils/getLightWeightUserInfoHelper.js";

const getPetSendedHandOverInvitationsController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const skip = parseInt( req.params.skip ) || 0;
        const limit = parseInt( req.params.limit ) || 15;

        const invitationQuery = { from: userId };
        const invitations = await PetHandOverInvitation.find( invitationQuery )
                                                       .skip( skip )
                                                       .limit( limit )
                                                       .lean();

        const totalInvitationCount = await PetHandOverInvitation.countDocuments( invitationQuery );
        if( invitations.length <= 0 ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "No Invitation Found"
                }
            );
        }

        for(
            let invitation
            of invitations
        ){

            const secondaryOwner = await User.findById( 
                                                invitation.to
                                                          .toString() 
                                              );
            if( !secondaryOwner ){
                continue;
            }
            const secondaryOwnerInfo = getLightWeightUserInfoHelper( secondaryOwner );
            invitation.to = secondaryOwnerInfo;

            const pet = await Pet.findById( invitation.petId.toString() );
            if (!pet) {
                continue; 
            }
            const petInfo = getLightWeightPetInfoHelper( pet );
            invitation.pet = petInfo;
            delete invitation.petId;

            delete invitation.__v;
        }

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