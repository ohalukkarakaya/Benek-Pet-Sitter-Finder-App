import User from "../../../../../models/User.js";
import Event from "../../../../../models/Event/Event.js";
import EventInvitation from "../../../../../models/Event/Invitations/InviteEvent.js";

const getSendedEventInvitationsController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();

        const invitations = await EventInvitation.find(
            {
                eventAdmin: userId
            }
        );

        if( invitations.length <= 0 ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "No Invitation Found"
                }
            );
        }

        invitations.forEach(
            async ( invitation ) => {
                const eventAdmin = await User.findById( 
                                                    invitation.eventAdminId
                                                              .toString() 
                                         );

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
                }

                invitation.admin = eventAdminInfo;
                delete invitation.eventAdminId;

                const invitedEvent = await Event.findById( invitation.eventId );

                const ticketPrice = invitedEvent.ticketPrice.priceType !== "Free" 
                                    ? `${invitedEvent.ticketPrice.price} ${invitedEvent.ticketPrice.priceType}`
                                    : `${invitedEvent.ticketPrice.priceType}`

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
                    ticketPrice: ticketPrice,
                    adress: invitedEvent.adress,
                    date: invitedEvent.date,
                    maxGuests: invitedEvent.maxGuests,
                    willJoinCount: invitedEvent.willJoin.length,
                    joinedCount: invitedEvent.joined.length,
                    didpast: didPast,
                    quota: eventQuota,
                };

                invitation.event = eventInfo;
                delete invitation.eventId;
                delete invitation.invitedId;
            }
        );

        return res.status( 200 ).json(
            {
                error: true,
                message: "Sended Invitation List Prepared Succesfully",
                invitations: invitations
            }
        );
    }catch( err ){
        console.log("ERROR: getSendedEventInvitationsController - ", err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default getSendedEventInvitationsController;