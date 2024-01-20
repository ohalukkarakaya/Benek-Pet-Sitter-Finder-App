import User from "../../../../../models/User.js";
import Event from "../../../../../models/Event/Event.js";
import EventInvitation from "../../../../../models/Event/Invitations/InviteEvent.js";
import getLightWeightUserInfoHelper from "../../../../../utils/getLightWeightUserInfoHelper.js";
import getLightWeightEventInfoHelper from "../../../../../utils/getLightWeightEventInfoHelper.js";

const getSendedEventInvitationsController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const lastElementId = req.body.lastElementId || 'null';
        const limit = parseInt( req.body.limit ) || 15;

        const invitationQuery = { eventAdminId: userId };
        let invitationFilter = { eventAdminId: userId };

        if( lastElementId !== 'null' ){
            const lastItem = await EventInvitation.findById( lastElementId );
            if( lastItem ){
                invitationFilter.createdAt = { $gt: lastItem.createdAt };
            }
        }

        const totalInvitationCount = await EventInvitation.countDocuments( invitationQuery ); 
        const invitations = await EventInvitation.find(invitationFilter).sort({ createdAt: 1 }).limit( limit ).lean();

        if( invitations.length <= 0 ){
            return res.status( 404 ).json({
                error: true,
                message: "No Invitation Found"
            });
        }

        for( let invitation of invitations ){
            const invitedUser = await User.findById( invitation.invitedId.toString() );
            const invitedUserInfo = getLightWeightUserInfoHelper( invitedUser );
            invitation.invitedUser = invitedUserInfo;
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

        return res.status( 200 ).json({
            error: true,
            message: "Sended Invitation List Prepared Succesfully",
            totalInvitationCount: totalInvitationCount,
            invitations: invitations
        });
    }catch( err ){
        console.log("ERROR: getSendedEventInvitationsController - ", err);
        return res.status( 500 ).json({
            error: true,
            message: "Internal Server Error"
        });
    }
}

export default getSendedEventInvitationsController;