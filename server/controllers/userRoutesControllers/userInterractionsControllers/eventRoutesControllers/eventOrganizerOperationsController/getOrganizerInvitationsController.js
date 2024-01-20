import OrganizerInvitation from "../../../../../models/Event/Invitations/InviteOrganizer.js";

import prepareInviteOrganizerDataHelper from "../../../../../utils/invitations/invitationDataHelpers/prepareInviteOrganizerDataHelper.js";

const getOrganizerInvitationsController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const lastElementId = req.params.lastElementId || 'null';
        const limit = parseInt( req.params.limit ) || 15;

        const invitationQuery = { invitedId: userId };
        let invitationFilter = { invitedId: userId };

        if( lastElementId !== 'null' ){
            const lastItem = await OrganizerInvitation.findById( lastElementId );
            if( lastItem ){
                invitationFilter.createdAt = { $gt: lastItem.createdAt };
            }
        }

        const totalInvitationCount = await OrganizerInvitation.countDocuments( invitationQuery );
        const organizerInvitations = await OrganizerInvitation.find( invitationFilter ).sort({ createdAt: 1 }).limit( limit ).lean();

        if( organizerInvitations.length <= 0 ){
            return res.status( 404 ).json({
                error: true,
                message: "No Organizer Invitation Found"
            });
        }

        let newInvitationList = [];
        for( let invitation of organizerInvitations ){
            const preparedInvitationData = await prepareInviteOrganizerDataHelper( invitation );
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
            error: false,
            message: "Invitation list prepared succesfully",
            totalInvitationCount: totalInvitationCount,
            organizerInvitations: newInvitationList
        });

    }catch( err ){
        console.log("ERROR: getOrganizerInvitationsController - ", err);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
}

export default getOrganizerInvitationsController;