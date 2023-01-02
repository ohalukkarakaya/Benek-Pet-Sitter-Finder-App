import cron from "node-cron";
import Event from "../models/Event/Event.js";
import EventTicket from "../models/Event/EventTicket.js";
import s3 from "../utils/s3Service.js";
import dotenv from "dotenv";

dotenv.config();

const expireEvents = cron.schedule(
    '0 0 0 * * *',
    async () => {
        try{
            const expiredEvents = await Event.find().where('expiryDate').lte(Date.now());
            expiredEvents.map(
                async (meetingEvent) => {
                    const soldTickets = await EventTicket.find({ eventId: meetingEvent._id.toString() });
                    const cancelPayments = soldTickets.map(
                        (ticket) => {
                            return new Promise(
                                (resolve, reject) => {
                                    if(
                                        ticket.paidPrice.priceType !== "Free"
                                        && ticket.paidPrice.price > 0
                                    ){
                                        //To Do: cancel payment
                                    }

                                    ticket.deleteOne().then(
                                        (_) => {
                                            return resolve(true);
                                        }
                                    ).catch(
                                        (error) => {
                                            if(error){
                                                console.log(error);
                                            }
                                        }
                                    )
                                }
                            );
                        }
                    );
                    
                    Promise.all(cancelPayments).then(
                        (_) => {
                            //delete images of event
                            async function emptyS3Directory(bucket, dir){
                            const listParams = {
                                Bucket: bucket,
                                Prefix: dir
                            };
                            const listedObjects = await s3.listObjectsV2(listParams);
                            if (listedObjects.Contents.length === 0) return;
                            const deleteParams = {
                                Bucket: bucket,
                                Delete: { Objects: [] }
                            };
        
                            listedObjects.Contents.forEach(({ Key }) => {
                                deleteParams.Delete.Objects.push({ Key });
                            });
                            await s3.deleteObjects(deleteParams);
                                if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
                            }
                            emptyS3Directory(process.env.BUCKET_NAME, `events/${meetingEvent._id.toString()}/`).then(
                                (_) => {
                                  //delete pet
                                  meetingEvent.deleteOne().then(
                                    (_) => {
                                        console.log("deleted an expired event");
                                    }
                                  ).catch(
                                    (error) => {
                                      console.log(error);
                                    }
                                  );
                                }
                              );
                        }
                    );
                }
            );
        }catch(err){
            console.log(err);
        }
    }
);

export default expireEvents;