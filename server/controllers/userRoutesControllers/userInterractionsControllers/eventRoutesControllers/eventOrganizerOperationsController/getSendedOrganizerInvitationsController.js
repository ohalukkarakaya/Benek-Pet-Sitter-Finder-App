import User from "../../../../../models/User.js";
import Event from "../../../../../models/Event/Event.js";
import OrganizerInvitation from "../../../../../models/Event/Invitations/InviteOrganizer.js";
import getLightWeightUserInfoHelper from "../../../../../utils/getLightWeightUserInfoHelper.js";
import getLightWeightEventInfoHelper from "../../../../../utils/getLightWeightEventInfoHelper.js";

const getSendedOrganizerInvitationsController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const skip = parseInt( req.params.skip ) || 0;
        const limit = parseInt( req.params.limit ) || 15;

        const invitationQuery = { eventAdminId: userId };
        const organizerInvitations = await OrganizerInvitation.find( invitationQuery )
                                                              .skip( skip )
                                                              .limit( limit )
                                                              .lean();

        const totalInvitationCount = await OrganizerInvitation.countDocuments( invitationQuery );

        if( organizerInvitations.length <= 0 ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "No Organizer Invitation Found"
                }
            );
        }

        for(
            let invitation
            of organizerInvitations
        ){
            const invitedEvent = await Event.findById( invitation.eventId.toString() );

            const eventInfo = await getLightWeightEventInfoHelper( invitedEvent );

            var eventDate = new Date( invitedEvent.date );
            var now = new Date(); 
            const didPast = eventDate < now;

            const eventQuota = didPast 
                                || invitedEvent.maxGuests === -1
                                    ? -1
                                    : invitedEvent.maxGuests - invitedEvent.willJoin
                                                                            .length

            const invitedUser = await User.findById( invitation.invitedId.toString() );
            const invitedUserInfo = await getLightWeightUserInfoHelper( invitedUser );

            invitation.event = eventInfo;
            invitation.invitedUser = invitedUserInfo;
            invitation.eventAdmin = eventInfo.eventAdmin;
            delete invitation.eventId;
            delete invitation.eventAdminId;
            delete invitation.invitedId;
            delete invitation.__v;
        }

        return res.status( 200 ).json(
            {
                error: false,
                message: "Invitation list prepared succesfully",
                totalInvitationCount: totalInvitationCount,
                organizerInvitations: organizerInvitations
            }
        );
    }catch( err ){
        console.log("ERROR: getSendedOrganizerInvitationsController - ", err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default getSendedOrganizerInvitationsController;