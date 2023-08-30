import EventInvitation from "../../../../../models/Event/Invitations/InviteEvent.js";
import User from "../../../../../models/User.js";
import Event from "../../../../../models/Event/Event.js";

import getLightWeightEventInfoHelper from "../../../../../utils/getLightWeightEventInfoHelper.js";
import getLightWeightUserInfoHelper from "../../../../../utils/getLightWeightUserInfoHelper.js";

const getEventInvitationsController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const skip = parseInt( req.params.skip ) || 0;
        const limit = parseInt( req.params.limit ) || 15;

        const invitationQuery = { invitedId: userId };

        const invitations = await EventInvitation.find(
                                                        invitationQuery
                                                  ).skip( skip )
                                                   .limit( limit )
                                                   .lean(); 

        const totalInvitationCount = await EventInvitation.countDocuments( invitationQuery );

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
            const eventAdmin = await User.findById( 
                                                invitation.eventAdminId
                                                          .toString() 
                                          );

            const eventAdminInfo = getLightWeightUserInfoHelper( eventAdmin );

            invitation.admin = eventAdminInfo;
            delete invitation.invitedId;

            const invitedEvent = await Event.findById( invitation.eventId );

            const eventInfo = await getLightWeightEventInfoHelper( invitedEvent );

            invitation.event = eventInfo;
            invitation.ticketPrice = eventInfo.ticketPrice;

            delete invitation.eventId;
            delete invitation.eventAdminId;
            delete invitation.__v;
            delete invitation.createdAt;
            delete invitation.updatedAt;
        }

        return res.status( 200 )
                  .json(
                        {
                            error: true,
                            message: "Releated Invitation List Prepared Succesfully",
                            totalInvitationCount: totalInvitationCount,
                            invitations: invitations
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