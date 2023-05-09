import Event from "../../../../../models/Event/Event.js";
import OrganizerInvitation from "../../../../../models/Event/Invitations/InviteOrganizer.js";

const getOrganizerInvitationsController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();

        const organizerInvitations = await OrganizerInvitation.find(
            {
                invitedId: userId
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

                const eventAdmin = await User.findById( invitedEvent.eventAdmin.toString() );
                const eventAdminInfo = {

                    userId: eventAdmin._id
                                      .toString(),
    
                    userProfileImg: eventAdmin.profileImg
                                              .imgUrl,
    
                    username: eventAdmin.userName,
    
                    userFullName: `${
                            eventAdmin.identity
                                      .firstName
                        } ${
                            eventAdmin.identity
                                      .middleName
                        } ${
                            eventAdmin.identity
                                      .lastName
                        }`.replaceAll( "  ", " ")
                };

                invitation.event = eventInfo;
                invitation.admin = eventAdminInfo;
                delete invitation.eventId;
                delete invitation.eventAdminId;
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
        console.log("ERROR: getOrganizerInvitationsController - ", err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default getOrganizerInvitationsController;