import User from "../../../../../models/User.js";
import Event from "../../../../../models/Event/Event.js";
import EventTicket from "../../../../../models/Event/EventTicket.js";
import EventInvitation from "../../../../../models/Event/Invitations/InviteEvent.js";

import mokaCreatePaymentHelper from "../../../../../utils/mokaPosRequests/mokaHelpers/mokaCreatePaymentHelper.js";

import bcrypt from "bcrypt";
import crypto from "crypto";
import QRCode from "qrcode";
import dotenv from "dotenv";

dotenv.config();

const acceptEventInvitationController = async ( req, res ) => {
    try{
        const response = req.params.response === "true";
        let orderId;
        
        if(
            !req.params.invitationId
            || ( typeof response ) !== 'boolean'
        ){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "Missing or wrong parameter"
                            }
                      );
        }

        const invitation = await EventInvitation.findById(
                                                    req.params
                                                       .invitationId
                                                 );

        if( !invitation ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "Invitation not found"
                            }
                      );
        }

        if(
            invitation.invitedId !== req.user
                                        ._id
                                        .toString()
        ){
            return res.status( 401 )
                      .json(
                            {
                                error: true,
                                message: "this is not your invitation"
                            }
                       );
        }

        const event = await Event.findById( invitation.eventId );
        const isAlreadyJoined = event.willJoin
                                     .find( 
                                        userId => 
                                            userId === req.user
                                                          ._id
                                                          .toString() 
                                     );

        if(
            isAlreadyJoined
            || !response
            || !event
            || event.date <= Date.now()
            || (
                event.maxGuests !== -1
                && event.maxGuests <= event.willJoin
                                           .length
            )
        ){
            await invitation.deleteOne()
                            .then(
                                (_) => {
                                    if( !response ){
                                        return res.status( 500 )
                                                  .json(
                                                        {
                                                            error: true,
                                                            message: "Invitation rejected succesfully"
                                                        }
                                                   );
                                    }else{
                                        if( isAlreadyJoined ){
                                            return res.status( 400 )
                                                      .json(
                                                            {
                                                                error: true,
                                                                message: "You are already participant of the event"
                                                            }
                                                       );
                                        }else{
                                            return res.status( 500 )
                                                      .json(
                                                            {
                                                                error: true,
                                                                message: "Invitation is invalid"
                                                            }
                                                       );
                                        }
                                    }
                                }
                            ).catch(
                                ( error ) => {
                                    console.log( error );
                                    return res.status( 500 )
                                              .json(
                                                    {
                                                        error: true,
                                                        message: "Internal server error"
                                                    }
                                              );
                                }
                            );
        }

        if(
            invitation.ticketPrice
                      .priceType !== "Free" 
            
            && invitation.ticketPrice
                         .price !== 0
        ){
            let recordCard = true;
            let cardGuid;

            cardGuid = req.body.cardGuid
                        ? req.body.cardGuid.toString()
                        : null;
            const cardNo = req.body.cardNo.toString();
            const cvc = req.body.cvc.toString();
            const cardExpiryDate = req.body.cardExpiryDate.toString();
            const userId = req.user._id.toString();

            const price = parseFloat(
                                invitation.ticketPrice
                                          .price
                          );

            //take payment
            if( 
                req.body.recordCard
            ){
                recordCard = req.body.recordCard === 'true';
            }

            const eventAdmin = await User.findById( invitation.eventAdminId );
            if( !eventAdmin ){
                return res.status( 404 )
                          .json(
                            {
                                error: true,
                                message: "Event Admin Not Found!"
                            }
                          );
            }

            const redirectUrl = process.env.BASE_URL + "/api/paymentRedirect";

            const paymentData = await mokaCreatePaymentHelper(
                                    userId, //customer user id
                                    cardGuid,//card guid
                                    cardNo, //card number
                                    cardExpiryDate.split("/")[0], //card expiry month
                                    cardExpiryDate.split("/")[1], //card expiry year
                                    cvc, //card cvc
                                    invitation._id.toString(),//parent id
                                    "EventTicket", //payment type
                                    invitation.eventAdminId, //caregiver id
                                    eventAdmin.careGiveGUID, //caregiver guid
                                    price, // amount
                                    redirectUrl,
                                    recordCard,
                                    true, // is from invitation
                                );

            if( 
                !paymentData
                || paymentData.error
                || paymentData.serverStatus !== 1
                || !paymentData.payData
                || paymentData.payData === null
                || paymentData.payData === undefined
            ){
                return res.status( 500 )
                          .json(
                            {
                                error: true,
                                message: "Error While Payment",
                                payError: paymentData
                            }
                          );
            }

            return res.status( 200 )
                      .json(
                        {
                            error: false,
                            message: "Waiting for 3d payment approve",
                            payData: paymentData.payData,
                            ticket: null
                        }
                      );
        }

        const randPassword = crypto.randomBytes(10).toString('hex');

        //generate ticket
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashTicketPassword = await bcrypt.hash(randPassword, salt);
        const paidPrice = invitation.ticketPrice
                                    .price
                                    .toLocaleString( 'tr-TR' )
                                    .replace( '.', '' );

        await new EventTicket(
            {
                eventOrganizers: event.eventOrganizers,
                eventId: event._id.toString(),
                userId: req.user._id.toString(),
                ticketPassword: hashTicketPassword,
                paidPrice: paidPrice,
                orderId: orderId,
                orderInfo: {
                    pySiparisGuid: paramAddDetailToOrderRequest.data.PYSiparis_GUID,
                    sanalPosIslemId: paramAddDetailToOrderRequest.data.SanalPOS_Islem_ID,
                    subSellerGuid: paramAddDetailToOrderRequest.data.GUID_AltUyeIsyeri
                },
                eventDate: event.date,
                expiryDate: event.expiryDate,
                isPrivate: event.isPrivate
            }
        ).save()
         .then(
            ( ticket ) => {
                const data = {
                    ticketId: ticket._id.toString(),
                    userId: req.user._id.toString(),
                    eventId: event._id.toString(),
                    ticketPassword: randPassword,
                }

                let ticketData = JSON.stringify(data);

                // Get the base64 url
                QRCode.toDataURL(
                    ticketData,
                    function (err, url) {
                        if(err){
                            return res.status(500).json(
                                {
                                    error: true,
                                    message: "error wile generating QR code"
                                }
                            );
                        }
                        ticket.ticketUrl = url;
                        ticket.markModified("ticketUrl");
                        ticket.save().then(
                            (code) => {
                                event.willJoin.push(req.user._id.toString());
                                event.markModified("willJoin");
                                event.save(
                                    (error) => {
                                        if(error){
                                            console.log(error);
                                            return res.status(500).json(
                                                {
                                                    error: true,
                                                    message: "Internal sefver error"
                                                }
                                            );
                                        }
                                    }
                                );
                                invitation.deleteOne()
                                          .then(
                                            (_) => {
                                                return res.status( 200 )
                                                          .json(
                                                                {
                                                                    error: false,
                                                                    message: `You accepted the invitation for event with "${event._id}" id succesfully`,
                                                                    payData: null,
                                                                    ticket: code.ticketUrl
                                                                }
                                                          );
                                            }
                                          ).catch(
                                                ( error ) => {
                                                    console.log( error );
                                                    return res.status( 500 )
                                                              .json(
                                                                    {
                                                                        error: true,
                                                                        message: "Internal server error"
                                                                    }
                                                              );
                                                }
                                          );
                            }
                        ).catch(
                            ( error ) => {
                                console.log( error );
                                return res.status( 500 )
                                          .json(
                                                {
                                                    error: true,
                                                    message: "Internal server error"
                                                }
                                          );
                            }
                        );
                    }
                );
            }
        ).catch(
            ( err ) => {
                console.log( err) ;
                return res.status( 500 )
                          .json(
                                {
                                    error: true,
                                    message: "Internal server error"
                                }
                          );
            }
        );
    }catch( err ){
        console.log("ERROR: accept invitation - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
} 

export default acceptEventInvitationController;