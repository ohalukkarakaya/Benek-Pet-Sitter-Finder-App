import User from "../../../../../models/User.js";
import Event from "../../../../../models/Event/Event.js";
import EventTicket from "../../../../../models/Event/EventTicket.js";

import mokaApprove3dPaymentRequest from "../../../../../utils/mokaPosRequests/mokaPayRequests/mokaApprove3dPaymentRequest.js";

import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const useTicketController = async ( req, res ) => {
    try{
        const eventId = req.params.eventId;
        const ticketId = req.body.ticketId;
        const ticketOwnerId = req.body.userId;
        const ticketPassword = req.body.ticketPassword;

        if(
            !eventId
            || !ticketId
            || !ticketOwnerId
            || !ticketPassword
        ){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "missing param"
                            }
                      );
        }
        const meetingEvent = await Event.findById(
                                                req.params
                                                   .eventId
                                        );
        if( !meetingEvent ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "event not found"
                            }
                       );
        }
        
        const ticket = await EventTicket.findById( ticketId );
        if( !ticket ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "ticket not found"
                            }
                       );
        }

        if(
            ticket.eventOrganizers !== meetingEvent.eventOrganizers
        ){
            ticket.eventOrganizers = meetingEvent.eventOrganizers;
            ticket.markModified("eventOrganizers");
        }
        const isEventToday = meetingEvent.date !== Date.now();
        const isOrganizer = meetingEvent.eventOrganizers
                                        .find( 
                                            userId => 
                                                userId === req.user
                                                              ._id
                                                              .toString()
                                         );


        if( ticket.eventId !== eventId ){
            return res.status( 401 )
                      .json(
                            {
                                error: true,
                                message: "wrong event"
                            }
                      );
        }
        
        const isUserInGuestList = meetingEvent.willJoin
                                              .find(
                                                    userId => 
                                                        userId.toString() === ticket.userId
                                                                                    .toString()
                                              );
        if( !isUserInGuestList ){
            return res.status( 403 )
                      .json(
                            {
                                error: true,
                                message: "Unexpected guest"
                            }
                      );
        }

        const ticketOwner = await User.findById( ticket.userId );
        if(
            !ticketOwner 
            || ticketOwner.deactivation
                          .isDeactive
        ){
            ticket.deleteOne()
                  .then(
                        (_) => {
                            return res.status( 500 )
                                      .json(
                                            {
                                                error: true,
                                                message: `User with the id "${ticketOwner._id}" not found therefore ticket has been terminated`
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

        if( !isEventToday ){
            return res.status( 401 )
                      .json(
                            {
                                error: true,
                                message: "Event is not today"
                            }
                      );
        }

        if( !isOrganizer ){
            return res.status( 403 )
                      .json(
                            {
                                error: true,
                                message: "You are not authorized to accept tickets"
                            }
                      );
        }

        const verifiedPassword = await bcrypt.compare(
                                                    ticketPassword,
                                                    ticket.ticketPassword
                                              );
        if( !verifiedPassword ){
            return res.status( 403 )
                      .json(
                            {
                                error: true,
                                message: "Invlid ticket"
                            }
                      );
        }

        meetingEvent.willJoin = meetingEvent.willJoin
                                            .filter( 
                                                userId => 
                                                    userId !== ticket.userId
                                                                     .toString() 
                                            );

        meetingEvent.markModified( "willJoin" );
        
        meetingEvent.joined
                    .push( ticket.userId.toString() );

        meetingEvent.markModified( "joined" );

        meetingEvent.save()
                    .then(
                        async ( meetEvent ) => {
                            if(
                                meetEvent.ticketPrice.priceType !== "Free" 
                                && meetEvent.ticketPrice.price !== 0
                                && ticket.orderId
                                && ticket.orderInfo.pySiparisGuid
                            ){
                                //approve payment
                                const approvePayment = await mokaApprove3dPaymentRequest(
                                                                    meetEvent.eventAdminCareGiveGuid,
                                                                    ticket.orderInfo.sanalPosIslemId
                                                             );
                                if( 
                                    !approvePayment 
                                    || approvePayment.error === true 
                                ){
                                    return res.status( 500 )
                                              .json(
                                                    {
                                                        error: true,
                                                        message: "error on aprrove payment"
                                                    }
                                              );
                                }
                            }

                            ticket.deleteOne()
                                  .then(
                                        (_) => {
                                            return res.status( 200 )
                                                    .json(
                                                            {
                                                                error: false,
                                                                message: `You accepted the ticket of the user with the id "${ticketOwner._id}", succesfully`,
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
        
    }catch( err ){
        console.log( "ERROR: use ticket - ", err );
        return res.status( 500 )
                  .json(
                        {
                            error: true,
                            message: "Internal server error"
                        }
                  );
    }
}

export default useTicketController;