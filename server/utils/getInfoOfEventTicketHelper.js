import User from "../models/User.js";

import getLightWeightUserInfoHelper from "./getLightWeightUserInfoHelper.js";

const getTicketInfoHelper = async ( ticket, eventData ) => {
    try{

        const eventAdmin = await User.findById( eventData.eventAdmin.toString() );
        const eventAdminInfo = getLightWeightUserInfoHelper( eventAdmin );

        let organizers = [];
        for(
            let organizerId
            of eventData.eventOrganizers
        ){
            const organizer = await User.findById( organizerId.toString() );
            const organizerObject = getLightWeightUserInfoHelper( organizer );

            organizers.push( organizerObject );
        }

        return {
            ticketId: ticket._id.toString(),
            eventId: eventData._id.toString(),
            eventImage: eventData.imgUrl,
            eventDesc: eventData.desc,
            eventAdmin: eventAdminInfo,
            eventOrganizers: organizers,
            eventAdress: eventData.adress,
            ticketPrice: eventData.ticketPrice.priceType !== 'Free'
                    ? `${ eventData.ticketPrice.price } ${ eventData.ticketPrice.priceType }`
                    : eventData.ticketPrice.priceType,
            boughtAt: ticket.boughtAt,
            isPrivate: ticket.isPrivate,
            eventDate: ticket.eventDate,
            orderId: ticket.orderId,
            ticketUrl: ticket.ticketUrl
        };

    }catch( err ){
        console.log( "ERROR: event ticket info - ", err );
        return err;
    }
}

export default getTicketInfoHelper;