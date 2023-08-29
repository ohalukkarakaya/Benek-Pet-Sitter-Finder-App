import Event from "../../../../../models/Event/Event.js";
import EventTicket from "../../../../../models/Event/EventTicket.js";
import s3 from "../../../../../utils/s3Service.js";

import mokaReject3dPaymentRequest from "../../../../../utils/mokaPosRequests/mokaPayRequests/mokaReject3dPaymentRequest.js";

import dotenv from "dotenv";

dotenv.config();

const deleteEventController = async ( req, res ) => {
    try{
        const eventId = req.params
                           .eventId;

        if( !eventId ){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "missing params"
                            }
                      );
        }

        const meetingEvent = await Event.findById( eventId );
        if( !meetingEvent ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "Event not found"
                            }
                      );
        }

        if(
            meetingEvent.eventAdmin
                        .toString() !== req.user
                                           ._id
                                           .toString()
        ){
            return res.status( 401 )
                      .json(
                            {
                                error: true,
                                message: "you are not authorized to delete this event"
                            }
                      );
        }

        if(
            Date.parse( meetingEvent.date ) <= Date.now()
        ){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "too late to delete this event"
                            }
                      );
        }

        const soldTickets = await EventTicket.find( { eventId: eventId } );
        const cancelPayments = soldTickets.map(
            ( ticket ) => {
                return new Promise(
                    async (resolve, reject) => {
                        if(
                            ticket.paidPrice.priceType !== "Free"
                            && ticket.paidPrice.price > 0
                        ){
                            //cancel payment
                            const cancelPayment = await mokaReject3dPaymentRequest(
                                                            meetingEvent.eventAdminCareGiveGuid,
                                                            ticket.orderInfo.pySiparisGuid
                                                        );

                            if(
                                !cancelPayment 
                                || cancelPayment.error === true 
                                || !( cancelPayment.data )
                            ){
                                return res.status( 500 ).json(
                                    {
                                        error: true,
                                        message: "Internal server error"
                                    }
                                );
                            }                            
                        }

                        ticket.deleteOne().then(
                            (_) => {
                                return resolve( true );
                            }
                        ).catch(
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
                        )
                    }
                );
            }
        );

        Promise.all( cancelPayments ).then(
            (_) => {
                //delete images of event
                async function emptyS3Directory( bucket, dir ){
                    const listParams = {
                        Bucket: bucket,
                        Prefix: dir
                    };
                    const listedObjects = await s3.listObjectsV2( listParams );
                    if (
                        !listedObjects.Contents
                        || listedObjects.Contents
                                        .length === 0
                    ) return;
                    const deleteParams = {
                        Bucket: bucket,
                        Delete: { Objects: [] }
                    };

                    listedObjects.Contents
                                 .forEach(
                                    ( { Key } ) => {
                                    deleteParams.Delete
                                                .Objects
                                                .push( { Key } );
                                    }
                                 );

                    await s3.deleteObjects( deleteParams );
                        if ( listedObjects.IsTruncated ) await emptyS3Directory( bucket, dir );
                }
                emptyS3Directory(
                    process.env
                           .BUCKET_NAME, 
                    `events/${eventId.toString()}/`
                ).then(
                    (_) => {
                      //delete Event
                      meetingEvent.deleteOne()
                                  .then(
                                    (_) => {
                                    return res.status( 200 )
                                              .json(
                                                    {
                                                    error: false,
                                                    message: "Event deleted succesfully"
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
                                        message: "An error occured while deleting",
                                        error: error
                                    }
                                  );
                        }
                      );
                    }
                );
            }
        );
    }catch( err ){
        console.log( "ERROR: delete event - ", err );
        return res.status( 500 )
                  .json(
                        {
                            error: true,
                            message: "Internal server error"
                        }
                  );
    }
}

export default deleteEventController;