import User from "../../../../../models/User.js";
import Event from "../../../../../models/Event/Event.js";
import EventTicket from "../../../../../models/Event/EventTicket.js";

import getTicketInfoHelper from "../../../../../utils/getInfoOfEventTicketHelper.js";

const getTicketsByEventIdController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const eventId = req.params.eventId.toString();
        const lastElementId = req.params.lastElementId || 'null';
        const limit = parseInt( req.params.limit ) || 15;

        if( !eventId ){
            return res.status( 400 ).json({
                error: true,
                message: "Missing Params"
            });
        }

        const query = { eventId: eventId };
        let filter = { eventId: eventId };

        if( lastElementId !== 'null' ){
            const lastItem = await EventTicket.findById( lastElementId );
            if( lastItem ){
                filter.createdAt = { $gt: lastItem.createdAt };
            }
        }

        const totalTickets = await EventTicket.countDocuments( query );
        const eventTickets = await  EventTicket.find( filter ).sort({ createdAt: 1 }).limit( limit );
        
        if( eventTickets.length <= 0 ){
            return res.status( 404 ).json({
                error: true,
                message: "No ticket found"
            });
        }

        const eventOfTicket = await Event.findById( eventId.toString() );
        const isOrganizerOrAdmin = eventOfTicket.eventOrganizers.find(
            organizerId =>
                organizerId.toString() === userId
        );

        if( !isOrganizerOrAdmin ){
            return res.status( 401 ).json({
                error: true,
                message: "You are not authorized to see all tickets"
            });
        }

        let tickets = [];
        for( let ticket of eventTickets ){
            const ticketInfo = await getTicketInfoHelper( ticket, eventOfTicket );
            tickets.push( ticketInfo );
        }

        return res.status( 200 ).json({
            error: false,
            message: "Ticket List Prepared Succesfully",
            totalTicketCount: totalTickets,
            tickets: tickets
        });

    }catch( err ){
        console.log("ERROR: getTicketsByEventIdController - ", err);
        return res.status( 500 ).json({
            error: true,
            message: "Internal Server Error"
        });
    }
}

export default getTicketsByEventIdController;