import Event from "../models/Event/Event.js";
import EventTicket from "../models/Event/EventTicket.js";
import EventInvitation from "../models/Event/Invitations/InviteEvent.js";

import bcrypt from "bcrypt";
import crypto from "crypto";
import { QRCodeStyling } from "qr-code-styling-node/lib/qr-code-styling.common.js";
import nodeCanvas from "canvas";
import { JSDOM } from "jsdom";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

function generateQRCode( ticketData, ticket ){
    return new Promise(
        ( resolve, reject ) => {
            // qr code options
            const options = {
                width: 300,
                height: 300,
                data: ticketData,
                image: path.resolve( './src/benek_amblem.png' ),
                dotsOptions: {
                    type: "dots"
                },
            }

            const qrCodeSvgWithBlobImage = new QRCodeStyling({ 
                jsdom: JSDOM, // this is required
                nodeCanvas, // this is required
                type: "svg",
                ...options,
                imageOptions: {
                    saveAsBlob: true,
                    crossOrigin: "anonymous",
                    margin: 0
                },
                backgroundOptions: { color: 'rgba(255, 255, 255, 0)' },
                cornersSquareOptions: { type: 'dot' },
                cornersDotOptions: { type: 'extra-rounded' }
            });

            qrCodeSvgWithBlobImage.getRawData( "svg" ).then(async (url) => {
                ticket.ticketUrl = url.toString("base64");
                ticket.markModified( "ticketUrl" );
                const ticketToSend = await ticket.save();
                resolve( ticketToSend );
            });
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
            ? mentionedEvent.willJoin.push( userId )
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