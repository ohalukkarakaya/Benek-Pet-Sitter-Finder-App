import express from "express";
import User from "../../../../models/User.js";
import Event from "../../../../models/Event/Event.js";
import EventTicket from "../../../../models/Event/EventTicket.js";
import dotenv from "dotenv";
import auth from "../../../../middleware/auth.js";
import { uploadEventImage } from "../../../../middleware/contentHandle/serverHandleEventImage.js";
import eventJoinEndpoints from "./eventJoin.js";
import afterEventEndpoints from "./eventGuestInterractions.js";
import organizerEndpoints from "./organizerOperations.js";
import s3 from "../../../../utils/s3Service.js";

dotenv.config();

const router = express.Router();

//create event
router.post(
    "/",
    auth,
    uploadEventImage,
    async (req, res) => {
        try{
            const user = await User.findById(req.user._id);
            if(!user){
                return res.status(404).json(
                    {
                        error: true,
                        message: "User couldn't found"
                    }
                );
            }

            if(
                !req.body.desc
                || !req.body.adressDesc
                || !req.body.lat
                || !req.body.long
            ){
                return res.status(400).json(
                    {
                        error: true,
                        message: "Missing property"
                    }
                );
            }

            if(
                req.body.ticketPrice && !req.body.ticketPriceType
                || !req.body.ticketPrice && req.body.ticketPriceType
            ){
                return res.status(400).json(
                    {
                        error: true,
                        message: "Missing property for ticketprice"
                    }
                );
            }

            const eventDate = Date.parse(req.body.date);

            await new Event(
                {
                    eventAdmin: user._id.toString(),
                    eventOrganizers: [ req.user._id.toString() ],
                    desc: req.body.desc,
                    ticketPrice: {
                        priceType: req.body.ticketPriceType,
                        price: req.body.ticketPrice
                    },
                    adress: {
                        adressDesc: req.body.adressDesc,
                        lat: req.body.lat,
                        long: req.body.long
                    },
                    maxGuest: req.body.maxGuest,
                    date: eventDate,
                    expiryDate: new Date( eventDate + 7*24*60*60*1000 ),
                    isPrivate: req.body.isPrivate
                }
            ).save().then(
                (event) => {
                    return res.status(200).json(
                        {
                            error: false,
                            message: `Story with id ${event._id}, planed succesfully at ${event.date}`,
                            eventId: event._id.toString(),
                            desc: event.desc,
                            ticketPrice: event.ticketPrice,
                            adress: event.adress,
                            maxGuest: req.body.maxGuest,
                            date: eventDate
                        }
                    );
                }
            ).catch(
                (error) => {
                    return res.status(500).json(
                        {
                            error: true,
                            data: error,
                            message: "An error occured while saving event data"
                        }
                    );
                }
            );
        }catch(err){
            console.log("ERROR: create event - ", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);

//upload event image
router.put(
    "/image/:eventId",
    auth,
    uploadEventImage,
    async (req, res) => {
        try{
            const contentUrl = req.cdnUrl;
            if(!contentUrl){
                return res.status(400).json(
                    {
                        error: true,
                        message: "image is required"
                    }
                );
            }
            
            req.meetingEvent.ımgUrl = contentUrl;
            req.meetingEvent.markModified("imgUrl");
            req.save(
                (err) => {
                    if(err){
                        console.log(err);
                        return res.status.json(
                            {
                                error: true,
                                message: "Internal server error"
                            }
                        );
                    }
                }
            );

            return res.status(200).json(
                {
                    error: false,
                    message: "image uploaded succesfully",
                    imgUrl: contentUrl
                }
            );
        }catch(err){
            console.log("ERROR: upload event image - ", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);

//edit event
router.put(
    "/:eventId",
    auth,
    async (req, res) => {
        try{
            const eventId = req.params.eventId;
            if(!eventId){
                return res.status(400).json(
                    {
                        error: true,
                        message: "missing params"
                    }
                );
            }

            const meetingEvent = await Event.findById(eventId);
            if(!meetingEvent){
                return res.status(404).json(
                    {
                        error: true,
                        message: "event not found"
                    }
                );
            } 

            if(meetingEvent.eventAdmin.toString() !== req.user._id.toString()){
                return res.status(401).json(
                    {
                        error: true,
                        message: "you are not authorized to edit this event"
                    }
                );
            }

            if(Date.parse(meetingEvent.date) <= Date.now()){
                return res.status(400).json(
                    {
                        error: true,
                        message: "too late to edit this event"
                    }
                );
            }

            const newEventDesc = req.body.newEventDesc;
            if(newEventDesc){
                meetingEvent.desc = newEventDesc;
                meetingEvent.markModified("desc");
            }
            const newEventDate = req.body.newEventDesc;
            if(newEventDate){
                if(Date.parse(newEventDate) <= Date.now()){
                    return res.status(400).json(
                        {
                            error: true,
                            message: "New event date is not valid"
                        }
                    );
                }

                meetingEvent.date = Date.parse(newEventDate);
                meetingEvent.expiryDate = new Date( newEventDate + 7*24*60*60*1000 );
                meetingEvent.markModified("date");
                meetingEvent.markModified("expiryDate");
            }

            const newAdress = req.body.newAdress;
            if(newAdress){
                if(
                    !newAdress.adressDesc
                    || !newAdress.lat
                    || !newAdress.long
                ){
                    return res.status(400).json(
                        {
                            error: true,
                            message: "missing adress info"
                        }
                    );
                }

                meetingEvent.adress = newAdress;
                meetingEvent.markModified("adress");
            }

            const newPrice = req.body.newPrice;
            if(newPrice){
                if(
                    newPrice && !newPrice.priceType
                    || newPrice && ! newPrice.price
                ){
                    return res.status(400).json(
                        {
                            error: true,
                            message: "missing price param"
                        }
                    );
                }
                meetingEvent.ticketPrice = newPrice;
                meetingEvent.markModified("ticketPrice");
            }

            if(
                newEventDesc
                || newEventDate
                || newAdress
                || newPrice
            ){
                meetingEvent.save(
                    (error) => {
                        if(error){
                            console.log(error);
                            return res.status(500).json(
                                {
                                    error: true,
                                    message: "Internal server error"
                                }
                            );
                        }
                    }
                );

                return res.status(200).json(
                    {
                        error: false,
                        message: "event updated succesfully"
                    }
                );
            }else{
                return res.status(400).json(
                    {
                        error: true,
                        message: "Missing params"
                    }
                );
            }
        }catch(err){
            console.log("ERROR: edit event - ", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);

//delete event
router.delete(
    "/:eventId",
    auth,
    async (req, res) => {
        try{
            const eventId = req.params.eventId;
            if(!eventId){
                return res.status(400).json(
                    {
                        error: true,
                        message: "missing params"
                    }
                );
            }

            const meetingEvent = await Event.findById(eventId);
            if(!meetingEvent){
                return res.status(404).json(
                    {
                        error: true,
                        message: "Event not found"
                    }
                );
            }

            if(meetingEvent.eventAdmin.toString() !== req.user_id.toString()){
                return res.status(401).json(
                    {
                        error: true,
                        message: "you are not authorized to delete this event"
                    }
                );
            }

            if(Date.parse(meetingEvent.date) <= Date.now()){
                return res.status(400).json(
                    {
                        error: true,
                        message: "too late to delete this event"
                    }
                );
            }

            const soldTickets = await EventTicket.find({ eventId: eventId });
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
                                        return res.status(500).json(
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
                    emptyS3Directory(process.env.BUCKET_NAME, `events/${eventId.toString()}/`).then(
                        (_) => {
                          //delete pet
                          meetingEvent.deleteOne().then(
                            (_) => {
                              return res.status(200).json(
                                {
                                  error: false,
                                  message: "Event deleted succesfully"
                                }
                              );
                            }
                          ).catch(
                            (error) => {
                              console.log(error);
                                return res.status(500).json(
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
        }catch(err){
            console.log("ERROR: delete event - ", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);

//organizer operations
router.use("/organizer", organizerEndpoints);

//join events
router.use("/eventJoin", eventJoinEndpoints);

//after event interractions
router.use("/afterEvent", afterEventEndpoints);

export default router;