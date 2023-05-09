import User from "../../../../../models/User.js";
import Event from "../../../../../models/Event/Event.js";
import EventTicket from "../../../../../models/Event/EventTicket.js";

const getTicketByIdController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const ticketId = req.params.ticket.toString();
        if( !ticketId ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "Missing Params"
                }
            );
        }

        const ticket = EventTicket.findById( ticketId.toString() );
        if( 
            !ticket
            || ticket.userId !== userId
        ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "Ticket not found"
                }
            );
        }

        const eventOfTicket = await Event.findById( ticket.eventId.toString() );
        const eventAdmin = await User.findById( ticket.eventAdmin.toString() );
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

                return res.status( 200 ).json(
                    {
                        error: false,
                        message: "Ticket Data Prepared Succesfully",
                        ticket: ticketInfo
                    }
                );
                
    }catch( err ){
        console.log("ERROR: getTicketByIdController - ", err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default getTicketByIdController;