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
                const invitedUser = await User.findById( 
                                                    invitation.invitedId
                                                              .toString() 
                                         );

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
                }

                invitation.admin = invitedUserInfo;
                delete invitation.invitedId;

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
                delete invitation.eventAdminId;
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