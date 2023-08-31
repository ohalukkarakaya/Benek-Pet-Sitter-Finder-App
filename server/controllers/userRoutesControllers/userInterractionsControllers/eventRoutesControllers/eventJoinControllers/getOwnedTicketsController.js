import Event from "../../../../../models/Event/Event.js";
import EventTicket from "../../../../../models/Event/EventTicket.js";
import getTicketInfoHelper from "../../../../../utils/getInfoOfEventTicketHelper.js";

const getOwnedTicketsController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();

        const eventTickets = await  EventTicket.find(
            {
                userId: userId
            }
        ).lean();
        
        if( eventTickets.length <= 0 ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "No ticket found"
                }
            );
        }

        let tickets = [];

        for(
            let ticket
            of eventTickets
        ){
            const eventOfTicket = await Event.findById( ticket.eventId.toString() ).lean();

            const ticketInfo = await getTicketInfoHelper( ticket, eventOfTicket );

            tickets.push( ticketInfo );
        }

        return res.status( 200 ).json(
            {
                error: false,
                message: "Ticket List Prepared Succesfully",
                tickets: tickets
            }
        );
    }catch( err ){
        console.log( "ERROR: getOwnedTicketsController - ", err );
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default getOwnedTicketsController;