import Event from "../models/Event/Event.js";
import EventTicket from "../models/Event/EventTicket.js";
import EventInvitation from "../models/Event/Invitations/InviteEvent.js";

import bcrypt from "bcrypt";
import crypto from "crypto";
import QRCode from "qrcode";
import dotenv from "dotenv";

dotenv.config();

function generateQRCode( ticketData, ticket ){
    return new Promise(
        ( resolve, reject ) => {
            QRCode.toDataURL(
                ticketData, 
                async ( err, url ) => {
                    if ( err ) {
                        reject(
                            {
                                error: true,
                                serverStatus: -1,
                                message: "Internal server error"
                            }
                        );
                    } else {
                        ticket.ticketUrl = url;
                        ticket.markModified( "ticketUrl" );
                        const ticketToSend = await ticket.save();
                        resolve( ticketToSend );
                    }
                }
            );
        }
    );
}


const prepareEventTicketHelper = async (
    userId,
    invitationId,
    eventId,
    virtualPosOrderId,
    careGiverGuid,
    paymentUniqueCode
) => {
    try{
        const randPassword = crypto.randomBytes( 10 ).toString('hex');

        let invitation

        if( invitationId !== null ){
            invitation = await EventInvitation.findById( invitationId );
        }

        const eventIdToFind = invitation
                              && invitationId !== null
                              && eventId === null
                                ? invitation.eventId
                                : eventId

        const mentionedEvent = await Event.findById( eventIdToFind );

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashTicketPassword = await bcrypt.hash(randPassword, salt);
        const paidPrice = parseFloat(mentionedEvent.ticketPrice.price);

        const newEventTicketData = new EventTicket(
                {
                    eventOrganizers: mentionedEvent.eventOrganizers,
                    eventId: mentionedEvent._id.toString(),
                    userId: userId,
                    ticketPassword: hashTicketPassword,
                    paidPrice: paidPrice,
                    orderId: virtualPosOrderId,
                    orderInfo: {
                        pySiparisGuid: paymentUniqueCode,
                        sanalPosIslemId: virtualPosOrderId,
                        subSellerGuid: careGiverGuid
                    },
                    eventDate: mentionedEvent.date,
                    expiryDate: new Date(
                                        new Date(
                                            mentionedEvent.date
                                        ).getTime() 
                                        + 7 * 24 * 60 * 60 * 1000
                                ),
                    isPrivate: mentionedEvent.isPrivate,
                    ticketUrl: null
                }
        );

        const ticket = await newEventTicketData.save();

        const data = {
            ticketId: newEventTicketData._id.toString(),
            userId: userId,
            eventId: newEventTicketData.eventId,
            ticketPassword: randPassword,
        };

        let ticketData = JSON.stringify( data );

        const ticketToSend = await generateQRCode( ticketData, ticket );

        mentionedEvent.willJoin
        && mentionedEvent.willJoin.length >= 0
            ? mentionedEvent.willJoin
                            .push( userId )
            : mentionedEvent.willJoin = [ userId ];

        mentionedEvent.markModified( "willJoin" );
        const savedEvent = await mentionedEvent.save();

        if( invitationId ){
            await EventInvitation.findByIdAndDelete( invitationId );
        }

        if( ticketToSend ){
            return {
                error: false,
                serverStatus: 1,
                message: `You accepted the invitation for event with "${savedEvent._id}" id successfully`,
                payData: null,
                ticket: ticketToSend.ticketUrl,
                ticketId: ticketToSend._id.toString(),
                secondParentId: savedEvent._id.toString()
            };
        }

    }catch( err ){
        console.log( "ERROR: prepareEventTicketHelper - ", err );
        return {
            error: true,
            serverStatus: -1,
            message: "Internal Server Error"
        };
    }
};

export default prepareEventTicketHelper;