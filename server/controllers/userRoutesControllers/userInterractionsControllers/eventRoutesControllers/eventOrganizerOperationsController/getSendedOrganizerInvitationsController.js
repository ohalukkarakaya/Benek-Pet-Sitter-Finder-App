import Event from "../../../../../models/Event/Event.js";
import OrganizerInvitation from "../../../../../models/Event/Invitations/InviteOrganizer.js";

const getSendedOrganizerInvitationsController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();

        const organizerInvitations = await OrganizerInvitation.find(
            {
                eventAdmin: userId
            }
        );

        if( organizerInvitations.length <= 0 ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "No Organizer Invitation Found"
                }
            );
        }

        organizerInvitations.forEach(
            async ( invitation ) => {
                const invitedEvent = await Event.findById( invitation.eventId.toString() );

                var eventDate = new Date( invitedEvent.date );
                var now = new Date(); 
                const didPast = eventDate < now;

                const eventQuota = didPast 
                                   || invitedEvent.maxGuests === -1
                                        ? -1
                                        : invitedEvent.maxGuests - invitedEvent.willJoin
                                                                               .length

                const eventInfo = {
                    eventId: invitedEvent._id.toString(),
                    eventDesc: invitedEvent.desc,
                    eventImage: invitedEvent.imgUrl,
                    adress: invitedEvent.adress,
                    date: invitedEvent.date,
                    maxGuests: invitedEvent.maxGuests,
                    willJoinCount: invitedEvent.willJoin.length,
                    joinedCount: invitedEvent.joined.length,
                    didpast: didPast,
                    quota: eventQuota,
                    isPrivate: invitedEvent.isPrivate
                };

                const invitedUser = await User.findById( invitation.invitedId.toString() );
                const invitedUserInfo = {

                    userId: invitedUser._id
                                      .toString(),
    
                    userProfileImg: invitedUser.profileImg
                                               .imgUrl,
    
                    username: invitedUser.userName,
    
                    userFullName: `${
                            invitedUser.identity
                                       .firstName
                        } ${
                            invitedUser.identity
                                       .middleName
                        } ${
                            invitedUser.identity
                                       .lastName
                        }`.replaceAll( "  ", " ")
                };

                invitation.event = eventInfo;
                invitation.invitedUser = eventAdminInfo;
                delete invitation.eventId;
                delete invitation.invitedId;
            }
        );

        return res.status( 200 ).json(
            {
                error: false,
                message: "Invitation list prepared succesfully",
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