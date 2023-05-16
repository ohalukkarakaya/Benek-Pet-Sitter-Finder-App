import Pet from "../../../models/Pet.js";
import User from "../../../models/User.js";
import SecondaryOwnerInvitation from "../../../models/ownerOperations/SecondaryOwnerInvitation.js";
import getLightWeightPetInfoHelper from "../../../utils/getLightWeightPetInfoHelper.js";
import getLightWeightUserInfoHelper from "../../../utils/getLightWeightUserInfoHelper.js";

const getSendedSecondaryOwnerInvitationsController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const skip = parseInt( req.params.skip ) || 0;
        const limit = parseInt( req.params.limit ) || 15;

        const invitationQuery = { from: userId }
        const invitations = await SecondaryOwnerInvitation.find( invitationQuery )
                                                          .skip( skip )
                                                          .limit( limit );
                                                        
        const totalInvitationCount = await SecondaryOwnerInvitation.countDocuments( query );

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

                const secondaryOwnerInfo = getLightWeightUserInfoHelper( secondaryOwner );

                invitation.to = secondaryOwnerInfo;

                const pet = await Pet.findById( invitation.petId.toString() );

                const petInfo = getLightWeightPetInfoHelper( pet );

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
        console.log("ERROR: getSendedSecondaryOwnerInvitationsController - ", err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default getSendedSecondaryOwnerInvitationsController;