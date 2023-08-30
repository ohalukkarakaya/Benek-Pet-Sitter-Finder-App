import Event from "../models/Event/Event.js"
import EventTicket from "../models/Event/EventTicket.js";
import EventInvitation from "../models/Event/Invitations/InviteEvent.js";

import bcrypt from "bcrypt";
import crypto from "crypto";
import QRCode from "qrcode";
import dotenv from "dotenv";

dotenv.config();

const prepareEventTicketHelper = async (
    userId,
    invitationId,
    eventId
) => {
    try{
        const randPassword = crypto.randomBytes(10).toString('hex');

        const mentionedEvent = await Event.findById( eventId );

        //generate ticket
        const salt = await bcrypt.genSalt(
                                    Number( process.env.SALT )
                                    );

        const hashTicketPassword = await bcrypt.hash(
                                                    randPassword, 
                                                    salt
                                                );

        const paidPrice = parseFloat( 
                                mentionedEvent.ticketPrice
                                                .price
                            );

        await new EventTicket(
            {
                eventOrganizers: mentionedEvent.eventOrganizers,
                eventId: mentionedEvent._id.toString(),
                userId: userId,
                ticketPassword: hashTicketPassword,
                paidPrice: paidPrice,
                orderId: orderId,
                orderInfo: {
                    pySiparisGuid: paramAddDetailToOrderRequest.data.PYSiparis_GUID,
                    sanalPosIslemId: paramAddDetailToOrderRequest.data.SanalPOS_Islem_ID,
                    subSellerGuid: paramAddDetailToOrderRequest.data.GUID_AltUyeIsyeri
                },
                eventDate: mentionedEvent.date,
                expiryDate: mentionedEvent.expiryDate,
                isPrivate: mentionedEvent.isPrivate
            }
        ).save()
            .then(
            async ( ticket ) => {
                const data = {
                    ticketId: ticket._id.toString(),
                    userId: userId,
                    eventId: mentionedEvent._id.toString(),
                    ticketPassword: randPassword,
                }

                let ticketData = JSON.stringify(data);

                // Get the base64 url
                QRCode.toDataURL(
                    ticketData,
                    function (err, url) {
                        if(err){
                            return {
                                    error: true,
                                    serverStatus: -1,
                                    message: "error wile generating QR code"
                            }
                        }
                        ticket.ticketUrl = url;
                        ticket.markModified("ticketUrl");
                        ticket.save()
                                .then(
                                async ( code ) => {
                                    mentionedEvent.willJoin.push(req.user._id.toString());
                                    mentionedEvent.markModified("willJoin");
                                    mentionedEvent.save(
                                        ( error ) => {
                                            if( error ){
                                                console.log( error );
                                                return {
                                                        error: true,
                                                        serverStatus: -1,
                                                        message: "Internal sefver error"
                                                }
                                            }
                                        }
                                    );

                                    if( invitationId ){
                                        const invitation = await EventInvitation.findById( invitationId );
                                        invitation.deleteOne()
                                                    .then()
                                                    .catch(
                                                        ( error ) => {
                                                            if( error ){
                                                                console.log( error );
                                                                return {
                                                                    error: true,
                                                                    serverStatus: -1,
                                                                    message: "Internal server error"
                                                                }
                                                            }
                                                        }
                                                    );
                                    }
                                    return {
                                        error: false,
                                        serverStatus: 1,
                                        message: `You accepted the invitation for event with "${mentionedEvent._id}" id succesfully`,
                                        payData: null,
                                        ticket: code.ticketUrl
                                    }
                                }
                                ).catch(
                                    ( error ) => {
                                        console.log( error );
                                        return {
                                            error: true,
                                            serverStatus: -1,
                                            message: "Internal server error"
                                        }
                                    }
                                );
                    }
                );
            }
        ).catch(
            ( err ) => {
                console.log( err) ;
                return {
                    error: true,
                    serverStatus: -1,
                    message: "Internal server error"
                }
            }
        );
    }catch( err ){
        console.log( "ERROR: prepareEventTicketHelper - ", err );
        return {
            error: true,
            serverStatus: -1,
            message: "Internal Server Error"
        }
    }
}

export default prepareEventTicketHelper;