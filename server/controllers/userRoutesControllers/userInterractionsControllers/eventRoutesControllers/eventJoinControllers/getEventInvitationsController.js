import EventInvitation from "../../../../../models/Event/Invitations/InviteEvent.js";

import prepareEventInvitationDataHelper from "../../../../../utils/invitations/invitationDataHelpers/prepareEventInvitationDataHelper.js";

const getEventInvitationsController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const skip = parseInt( req.params.skip ) || 0;
        const limit = parseInt( req.params.limit ) || 15;

        const invitationQuery = { invitedId: userId };
        const invitations = await EventInvitation.find(
            invitationQuery
        ).skip( skip )
         .limit( limit );

        const totalInvitationCount = await EventInvitation.countDocuments( invitationQuery );

        if( invitations.length <= 0 ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "No Invitation Found"
                }
            );
        }

        let newInvitationList = [];
        for(
            let invitation
            of invitations
        ){
            const preparedInvitationData = await prepareEventInvitationDataHelper( invitation );
            if(
                !preparedInvitationData
                || !( preparedInvitationData.data )
                || preparedInvitationData.length <= 0
                || preparedInvitationData.error
            ){
                return res.status( 500 )
                          .json(
                            {
                                error: true,
                                message: preparedInvitationData.message
                            }
                          );
            }

            newInvitationList.push( preparedInvitationData.data );
        }

        return res.status( 200 )
                  .json(
                        {
                            error: true,
                            message: "Releated Invitation List Prepared Succesfully",
                            totalInvitationCount: totalInvitationCount,
                            invitations: newInvitationList
                        }
                  );
        
    }catch( err ){
        console.log( "ERROR: getEventInvitationsController - ", err );
        res.status( 500 )
           .json(
                {
                    error: true,
                    message: "Internal Server Error"
                }
            );
    }
}

export default getEventInvitationsController;