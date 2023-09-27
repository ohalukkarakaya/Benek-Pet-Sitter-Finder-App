import User from "../../../../../models/User.js";
import Event from "../../../../../models/Event/Event.js";
import EventTicket from "../../../../../models/Event/EventTicket.js";

import mokaValidateHourForVoidPaymentHelper from "../../../../../utils/mokaPosRequests/mokaHelpers/mokaValidateHourForVoidPaymentHelper.js";
import mokaCreatePaymentHelper from "../../../../../utils/mokaPosRequests/mokaHelpers/mokaCreatePaymentHelper.js";
import mokaVoid3dPaymentRequest from "../../../../../utils/mokaPosRequests/mokaPayRequests/mokaVoid3dPaymentRequest.js";

import prepareEventTicketHelper from "../../../../../utils/prepareEventTicketHelper.js";

import dotenv from "dotenv";
import PaymentData from "../../../../../models/PaymentData/PaymentData.js";

dotenv.config();

const buyTicketForEventController = async (req, res) => {
    try{
        const eventId = req.params.eventId.toString();

        if(
            !eventId
        ){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "evetId is required"
                            }
                      );
        }

        const event = await Event.findById( eventId );

        if( !event ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "Event not found"
                            }
                      );
        }

        if( 
            event.date <= Date.now() 
        ){
            return res.status( 403 )
                      .json(
                            {
                                error: true,
                                message: "You can't plan to join event today or cancel ticket anymore"
                            }
                      );
        }

        if( event.isPrivate ){
            return res.status( 401 )
                      .json(
                            {
                                error: true,
                                message: "You can join only if you invented"
                            }
                       );
        }

        const isAllreadyJoined = event.willJoin
                                      .find(
                                            userId => 
                                                userId === req.user
                                                              ._id
                                                              .toString()
                                      );

        if(
            !isAllreadyJoined 
            && event.maxGuests !== -1 
            && event.maxGuests <= event.willJoin
                                       .length
        ){
            return res.status( 400 )
                      .json(
                {
                    error: true,
                    message: "Guest quota exceeded"
                }
            );
        }

        if( isAllreadyJoined ){
            const eventTicket = await EventTicket.findOne(
                                            {
                                                eventId: event._id.toString(),
                                                userId: req.user._id.toString()
                                            }
                                      );

            if( !eventTicket ){
                return res.status( 500 )
                          .json(
                                {
                                    error: true,
                                    message: "Internal server error"
                                }
                          );
            }

            if(
                event.ticketPrice.priceType !== "Free" 
                && event.ticketPrice.price !== 0
                && eventTicket.orderId
                && eventTicket.orderInfo
            ){
                //cancel payment
                const cancelPayment = await mokaVoid3dPaymentRequest(  eventTicket.orderId );

                if( 
                    !cancelPayment 
                    || (
                        cancelPayment.serverStatus
                        && cancelPayment.serverStatus !== 0
                        && cancelPayment.serverStatus !== 1
                        && (
                            cancelPayment.error === true 
                            || !( cancelPayment.data )
                        )
                    )
                ){
                    return res.status( 500 )
                              .json(
                                    {
                                        error: true,
                                        message: "Internal server error"
                                    }
                              );
                }
            }

            eventTicket.deleteOne()
                       .then(
                            (_) => {
                                console.log( "deleted an ticket" );
                            }
                        ).catch(
                            ( error ) => {
                                console.log( error );
                            }
                          );

            event.willJoin = event.willJoin
                                  .filter(
                                        userId => 
                                            userId !== req.user
                                                          ._id
                                                          .toString()
                                   );

            event.markModified( "willJoin" );

            event.save(
                ( error ) => {
                    if( error ){
                        console.log( error );
                        return res.status( 500 )
                                  .json(
                                        {
                                            error: true,
                                            message: "Internal server error"
                                        }
                                   );
                    }
                }
            );

            return res.status( 200 )
                      .json(
                            {
                                error: false,
                                message: "Ticket removed and payment canceled succesfully"
                            }
                       );

        }else{
            if(
                event.ticketPrice.priceType !== "Free" 
                && event.ticketPrice.price !== 0
            ){

                const cardGuid = req.body.cardGuid 
                                ? req.body.cardGuid.toString() 
                                : null;

                const cardNo = req.body.cardNo.toString();
                const cvv = req.body.cvv.toString();
                const cardExpiryDate = req.body.cardExpiryDate.toString();
                const userId = req.user._id.toString();
                const price = parseFloat( event.ticketPrice.price );

                const redirectUrl = process.env.BASE_URL + "/api/payment/redirect";

                //take payment
                const paymentData = await mokaCreatePaymentHelper(
                                            userId, //customer user id
                                            cardGuid, //card guid
                                            cardNo, //card number
                                            cardExpiryDate.split( "/" )[ 0 ], //card expiry month
                                            cardExpiryDate.split( "/" )[ 1 ], //card expiry year
                                            cvv, //card cvv
                                            event._id.toString(), //parent id
                                            null, //productDesc
                                            "EventTicket", //payment type
                                            null,
                                            event.eventAdmin, //caregiver id
                                            ( 
                                                await User.findById( 
                                                                event.eventAdmin
                                                           ) 
                                            ).careGiveGUID, //caregiver guid
                                            price, // amount
                                            redirectUrl,
                                            req.body.recordCard === 'true',
                                            false // is from invitation
                                          );

                if( paymentData.message === 'Daily Limit Exceeded' ){
                    return res.status( 500 )
                              .json(
                                    {
                                        error: true,
                                        message: "Daily Limit Exceeded",
                                        payError: paymentData
                                    }
                              );
                }

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

            //prepare ticket for free events

            const careGiver = await User.findById( event.eventAdmin );
            if( 
                !careGiver 
                || careGiver.deactivation.isDeactive
            ){
                return res.status( 404 )
                          .json(
                                {
                                    error: true,
                                    message: "CareGiver not Found"
                                }
                          );
            }

            const eventTicketData = await prepareEventTicketHelper(
                req.user._id.toString(), //customer userId
                null, //eventInvitation Id
                eventId, //event Id
                "Free_Event", //virtualPosOrderId
                careGiver.careGiveGUID, //care Giver guid
                "Free_Event" // payment unique code
            );

            if(
                !eventTicketData
                || eventTicketData.error
            ){
                return res.status( 500 )
                          .json(
                            {
                                error: true,
                                message: "Internal Server Error"
                            }
                          );
            }
    
            return res.status( 200 )
                      .json( eventTicketData );

        }

    }catch( err ){

        console.log( "ERROR: buy ticket - ", err );
        return res.status( 500 )
                  .json(
                        {
                            error: true,
                            message: "Internal server error"
                        }
                  );

    }
}

export default buyTicketForEventController;