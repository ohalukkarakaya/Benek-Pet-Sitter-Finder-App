import User from "../../../../../models/User.js";
import Event from "../../../../../models/Event/Event.js";
import EventTicket from "../../../../../models/Event/EventTicket.js";

const getTicketsByEventIdController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const eventId = req.params.eventId.toString();
        if( !eventId ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "Missing Params"
                }
            );
        }

        const eventTickets = await  EventTicket.find(
            {
                eventId: eventId
            }
        );
        
        if( eventTickets.length <= 0 ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "No ticket found"
                }
            );
        }

        eventTickets.forEach(
            async ( ticket ) => {
                if(
                    userId === ticket.userId
                    || ticket.eventOrganizers.includes( userId ) 
                ){
                    const eventOfTicket = await Event.findById( ticket.eventId.toString() );
                    const eventAdmin = await User.findById( eventOfTicket.eventAdmin.toString() );
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

                    eventOfTicket.eventOrganizers.forEach(
                        async ( organizerId ) => {
                            const organizer = await User.findById( organizerId.toString() );
                            const organizerObject = {

                                userId: organizer._id
                                                .toString(),
                
                                userProfileImg: organizer.profileImg
                                                        .imgUrl,
                
                                username: organizer.userName,
                
                                userFullName: `${
                                        organizer.identity
                                                .firstName
                                    } ${
                                        organizer.identity
                                                .middleName
                                    } ${
                                        organizer.identity
                                                .lastName
                                    }`.replaceAll( "  ", " ")
                            };

                            organizerId = organizerObject;
                        }
                    );

                    const ticketInfo = {
                        ticketId: ticket._id.toString(),
                        eventId: eventOfTicket._id.toString(),
                        eventImage: eventOfTicket.imgUrl,
                        eventDesc: eventOfTicket.desc,
                        eventAdmin: eventAdminInfo,
                        eventOrganizers: eventOfTicket.eventOrganizers,
                        eventAdress: eventOfTicket.adress,
                        ticketPrice: ticket.paidPrice,
                        boughtAt: ticket.boughtAt,
                        isPrivate: ticket.isPrivate,
                        eventDate: ticket.eventDate,
                        orderId: ticket.orderId,
                        ticketUrl: ticket.ticketUrl
                    };

                    ticket = ticketInfo
                }else{
                    ticket = null;
                }
            }
        );

        return res.status( 200 ).json(
            {
                error: false,
                message: "Ticket List Prepared Succesfully",
                tickets: eventTickets
            }
        );
    }catch( err ){
        console.log("ERROR: getTicketsByEventIdController - ", err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default getTicketsByEventIdController;