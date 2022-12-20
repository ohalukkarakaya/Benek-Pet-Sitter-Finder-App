import express from "express";
import User from "../../../../models/User.js";
import Event from "../../../../models/Event/Event.js";
import OrganizerInvitation from "../../../../models/Event/Invitations/InviteOrganizer.js";
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
    "/:eventId",
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

//To Do: edit event

//To Do: delete event

//To Do: follow - unfollow event

//organizer operations
router.use("/organizer", organizerEndpoints);

//join events
router.use("/eventJoin", eventJoinEndpoints);

//after event interractions
router.use("/afterEvent", afterEventEndpoints);

export default router;