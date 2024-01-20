import Pet from "../../../models/Pet.js";
import User from "../../../models/User.js";
import PetHandOverInvitation from "../../../models/ownerOperations/PetHandOverInvitation.js";

import preparePetHandOverInvitationDataHelper from "../../../utils/invitations/invitationDataHelpers/preparePetHandOverInvitationDataHelper.js";

import getLightWeightPetInfoHelper from "../../../utils/getLightWeightPetInfoHelper.js";
import getLightWeightUserInfoHelper from "../../../utils/getLightWeightUserInfoHelper.js";

const getPetHandOverInvitationsController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const lastItemId = req.params.lastItemId || 'null';
        const limit = parseInt( req.params.limit ) || 15;

        const invitationQuery = { to: userId };
        const invitationFilter = { to: userId };

        if( lastItemId !== 'null' ){
            const lastItem = await PetHandOverInvitation.findById(lastItemId);
            if(lastItem){
                invitationFilter.createdAt = { $gt: lastItem.createdAt };
            }
        }

        const totalInvitationQuery = await PetHandOverInvitation.countDocuments( invitationQuery );
        const invitations = await PetHandOverInvitation.find( invitationFilter ).sort({ createdAt: 1 }).limit( limit ).lean();

        if( invitations.length <= 0 ){
            return res.status( 404 ).json({
                error: true,
                message: "No Invitation Found"
            });
        }

        let newInvitationList = [];
        for( let invitation of invitations ){
            const preparedInvitationData = await preparePetHandOverInvitationDataHelper( invitation );
            if(
                !preparedInvitationData
                || !( preparedInvitationData.data )
                || preparedInvitationData.length <= 0
                || preparedInvitationData.error
            ){
                return res.status( 500 ).json({
                    error: true,
                    message: preparedInvitationData.message
                });
            }

            newInvitationList.push( preparedInvitationData.data );
        }

        return res.status( 200 ).json({
            error: true,
            message: "Releated Invitation List Prepared Succesfully",
            totalInvitationQuery: totalInvitationQuery,
            invitations: newInvitationList
        });

    }catch( err ){
        console.log("ERROR: getSecondaryOwnerInvitationsController - ", err);
        res.status( 500 ).json({
            error: true,
            message: "Internal Server Error"
        });
    }
}

export default getPetHandOverInvitationsController;