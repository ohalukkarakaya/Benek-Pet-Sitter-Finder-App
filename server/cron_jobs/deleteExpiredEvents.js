import Event from "../models/Event/Event.js";
import EventTicket from "../models/Event/EventTicket.js";

import deleteFileHelper from "../utils/fileHelpers/deleteFileHelper.js";
import mokaVoid3dPaymentRequest from "../utils/mokaPosRequests/mokaPayRequests/mokaVoid3dPaymentRequest.js";

import cron from "node-cron";
import dotenv from "dotenv";

dotenv.config();

const expireEvents = cron.schedule(
    '0 0 0 * * *',
    // "* * * * *", // her dakika başı
    async () => {
        try{
            const now = new Date();

            const currentYear = now.getUTCFullYear();
            const currentMonth = now.getUTCMonth();
            const currentDate = now.getUTCDate();
            const currentHour = now.getUTCHours();

            const currentDateTime = new Date(
                                            currentYear, 
                                            currentMonth, 
                                            currentDate, 
                                            currentHour, 
                                            0, 
                                            0, 
                                            0
                                        );

            const expiredEvents = await Event.find()
                                             .where( 'expiryDate' )
                                             .lte( currentDateTime );

            expiredEvents.map(
                async ( meetingEvent ) => {
                    const soldTickets = await EventTicket.find({ eventId: meetingEvent._id.toString() });
                    const cancelPayments = soldTickets.map(
                        ( ticket ) => {
                            return new Promise(
                                async ( resolve, reject ) => {
                                    if(
                                        ticket.paidPrice.priceType !== "Free"
                                        && ticket.paidPrice.price > 0
                                        && ticket.orderId
                                        && ticket.orderInfo
                                        && ticket.orderInfo.pySiparisGuid
                                    ){
                                        //cancel payment
                                        const cancelPayment = await mokaVoid3dPaymentRequest( ticket.orderId );
                        
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
                                            console.log( "ERROR: While Canceling Payment" );
                                        }
                                    }

                                    ticket.deleteOne().then(
                                        (_) => {
                                            return resolve( true );
                                        }
                                    ).catch(
                                        ( error ) => {
                                            if(error){
                                                console.log( error );
                                            }
                                        }
                                    )
                                }
                            );
                        }
                    );
                    
                    Promise.all( cancelPayments ).then(
                        (_) => {
                            //delete images of event
                            const contentUrl = `events/${meetingEvent._id.toString()}/`;
                            deleteFileHelper( contentUrl ).then(
                                ( data ) => {

                                    if( data.error ){
                                        console.log( `ERROR: while deleting Event content '${ contentUrl }'` );
                                    }
        
                                    meetingEvent.deleteOne()
                                                .then(
                                                    (_) => {
                                                        console.log("one event deleted");
                                                    }
                                                ).catch(
                                                    ( error ) => {
                                                      console.log( error );
                                                    }
                                                );
        
                                }
                            );
                        }
                    );
                }
            );
        }catch( err ){
            console.log( err );
        }
    }
);

export default expireEvents;