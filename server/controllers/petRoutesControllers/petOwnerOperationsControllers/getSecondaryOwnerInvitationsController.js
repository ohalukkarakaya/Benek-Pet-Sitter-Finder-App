import SecondaryOwnerInvitation from "../../../models/ownerOperations/SecondaryOwnerInvitation.js";

import prepareSecondaryOwnerInvitationDataHelper from "../../../utils/invitations/invitationDataHelpers/prepareSecondaryOwnerInvitationDataHelper.js";

const getSecondaryOwnerInvitationsController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const skip = parseInt( req.params.skip ) || 0;
        const limit = parseInt( req.params.limit ) || 15;

        const invitationQuery = { to: userId };
        const invitations = await SecondaryOwnerInvitation.find( invitationQuery )
                                                          .skip( skip )
                                                          .limit( limit )
                                                          .lean();

        const totalInvitationCount = await SecondaryOwnerInvitation.countDocuments( invitationQuery );

        if( invitations.length <= 0 ){
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
            let invitation
            of invitations
        ){
            const preparedInvitationData = await prepareSecondaryOwnerInvitationDataHelper( invitation );
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
                            message: "Releated Invitation List Prepared Succesfully",
                            totalInvitationCount: totalInvitationCount,
                            invitations: newInvitationList
                        }
                  );
    }catch( err ){
        console.log( "ERROR: getSecondaryOwnerInvitationsController - ", err );
        res.status( 500 )
           .json(
                {
                    error: true,
                    message: "Internal Server Error"
                }
            );
    }
}

export default getSecondaryOwnerInvitationsController;