import Event from "../../../../../models/Event/Event.js";
import EventTicket from "../../../../../models/Event/EventTicket.js";

import getTicketInfoHelper from "../../../../../utils/getInfoOfEventTicketHelper.js";

const getTicketByIdController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const ticketId = req.params.ticketId.toString();
        if( !ticketId ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "Missing Params"
                }
            );
        }

        const ticket = await EventTicket.findById( ticketId.toString() );
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

        const ticketInfo = await getTicketInfoHelper( ticket, eventOfTicket );

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