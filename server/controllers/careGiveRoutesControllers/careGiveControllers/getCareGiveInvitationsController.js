import CareGive from "../../../models/CareGive/CareGive.js";

import prepareCareGiveInvitationDataHelper from "../../../utils/invitations/invitationDataHelpers/prepareCareGiveInvitationDataHelper.js";

const getCareGiveInvitationsController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const lasItem = req.params.lastItemId || 'null';
        const limit = parseInt( req.params.limit ) || 15;

        const invitationQuery = {
            "invitation.to": userId,
            "invitation.isAccepted": false
        };

        const invitationFilter = {
            "invitation.to": userId,
            "invitation.isAccepted": false
        }

        if( lasItem !== 'null' ){
            const lastItem = await CareGive.findById(lasItem);
            if(lastItem){
                invitationFilter.createdAt = { $gt: lastItem.createdAt };
            }
        }

        const totalInvitationCount = await CareGive.countDocuments( invitationQuery );
        const invitedCareGives = await CareGive.find( invitationFilter ).sort({ createdAt: 1 }).limit( limit );

        if( 
            !invitedCareGives
            || invitedCareGives.length <= 0 
        ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "No Invitation Found"
                            }
                      );
        }

        let newInvitationList = [];
        for(
            let careGiveObject
            of invitedCareGives
        ){
            const preparedInvitationData = await prepareCareGiveInvitationDataHelper( careGiveObject.toObject() );
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
                        error: false,
                        message: "Releated Care Give Inventations Listed",
                        totalInvitationCount: totalInvitationCount,
                        invitations: newInvitationList
                    }
                  );

    }catch( err ){
        console.log( "ERROR: getCareGiveInvitationsController - ", err );
        res.status( 500 )
           .json(
                {
                    error: true,
                    message: "Internal Server Error"
                }
           );
    }
}

export default getCareGiveInvitationsController;