import express from "express";
import User from "../../../../models/User.js";
import Event from "../../../../models/Event/Event.js";
import OrganizerInvitation from "../../../../models/Event/Invitations/InviteOrganizer.js";
import dotenv from "dotenv";
import auth from "../../../../middleware/auth.js";
import { uploadEventImage } from "../../../../middleware/contentHandle/serverHandleEventImage.js";
import eventJoinEndpoints from "./eventJoin.js";
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
            const contentUrl = req.cdnUrl;

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
                    imgUrl: contentUrl,
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
                            eventImgUrl: event.imgUrl,
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

//add organizer
router.put(
    "/organizer/:eventId",
    auth,
    async (req, res) => {
        try{
            const eventId = req.params.eventId;
            const organizerId = req.body.organizerId;
            if(!eventId || !organizerId){
                return res.status(400).json(
                    {
                        error: true,
                        message: "Missing or wrong params"
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

            if(meetingEvent.date <= Date.now()){
                return res.status(400).json(
                    {
                        error: true,
                        message: "This event is expired"
                    }
                );
            }

            const isAdmin = meetingEvent.eventAdmin === req.user._id.toString();
            if(!isAdmin){
                return res.status(403).json(
                    {
                        error: true,
                        message: "You are not authorized to invite organizer to this event"
                    }
                );
            }

            const organizer = await User.findById(organizerId);
            if(!organizer){
                return res.status(404).json(
                    {
                        error: true,
                        message: "User not found"
                    }
                );
            }
                
            await new OrganizerInvitation(
                {
                    eventAdminId: req.user._id.toString(),
                    eventId: meetingEvent._id.toString(),
                    invitedId: organizer._id.toString(),
                    eventDate: meetingEvent.date,
                }
            ).save().then(
                (invitation) => {
                    return res.status(200).json(
                        {
                            error: false,
                            message: `You invited user "${organizer._id.toString()}" successfully`
                        }
                    );
                }
            ).catch(
                (error) => {
                    console.log(error);
                    return res.status(500).json(
                        {
                            error: true,
                            message: "Internal server error"
                        }
                    );
                }
            );
            
        }catch(err){
            console.log("ERROR: invite event organizer - ", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);

//accept organizer invitation
router.delete(
    "/organizer/:invateId/:response",
    auth,
    async (req, res) => {
        try{
            const invateId = req.params.invateId;
            if(!invateId || req.params.response){
                return res.status(400).json(
                    {
                        error: true,
                        message: "Missing or wrong params"
                    }
                );
            }

            const response = req.params.response === "true";

            const invitation = await OrganizerInvitation.findById(invateId);
            if(!invitation){
                return res.status(404).json(
                    {
                        error: true,
                        message: "invitation not found"
                    }
                );
            }

            const meetingEvent = await Event.findById(invitation.eventId);
            if(!meetingEvent){
                return res.status(404).json(
                    {
                        error: true,
                        message: "meetingEvent not found"
                    }
                );
            }

            if(meetingEvent.date <= Date.now()){
                invitation.deleteOne().then(
                    (_) => {
                        return res.status(400).json(
                            {
                                error: true,
                                message: "This event is expired"
                            }
                        );
                    }
                ).catch(
                    (error) => {
                        console.log(error);
                        return res.status(500).json(
                            {
                                error: true,
                                message: "Internal server error"
                            }
                        );
                    }
                );
            }

            const isOrganizer = invitation.invitedId === req.user._id.toString();
            if(!isOrganizer){
                return res.status(403).json(
                    {
                        error: true,
                        message: "You are not authorized to accept this invitation"
                    }
                );
            }
            
            const isAlreadyOrganizer = meetingEvent.eventOrganizers.find(userId => userId === req.user._id.toString());
            if(isAlreadyOrganizer){
                return res.status(400).json(
                    {
                        error: true,
                        message: "you are already organizer"
                    }
                );
            }

            if(response){
                meetingEvent.eventOrganizers = meetingEvent.eventOrganizers.push(req.user._id.toString());
                meetingEvent.markModified("eventOrganizers");
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

                invitation.deleteOne().then(
                    (_) => {
                        return res.status(200).json(
                            {
                                error: false,
                                message: "invitation accepted succesfully"
                            }
                        );
                    }
                ).catch(
                    (error) => {
                        console.log(error);
                        return res.status(500).json(
                            {
                                error: true,
                                message: "Internal server error"
                            }
                        );
                    }
                );
            }else{
                invitation.deleteOne().then(
                    (_) => {
                        return res.status(200).json(
                            {
                                error: false,
                                message: "invitation rejected succesfully"
                            }
                        );
                    }
                ).catch(
                    (error) => {
                        console.log(error);
                        return res.status(500).json(
                            {
                                error: true,
                                message: "Internal server error"
                            }
                        );
                    }
                );
            }
                
            await new OrganizerInvitation(
                {
                    eventAdminId: req.user._id.toString(),
                    eventId: meetingEvent._id.toString(),
                    invitedId: organizer._id.toString(),
                    eventDate: meetingEvent.date,
                }
            ).save().then(
                (invitation) => {
                    return res.status(200).json(
                        {
                            error: false,
                            message: `You invited user "${organizer._id.toString()}" successfully`
                        }
                    );
                }
            ).catch(
                (error) => {
                    console.log(error);
                    return res.status(500).json(
                        {
                            error: true,
                            message: "Internal server error"
                        }
                    );
                }
            );
            
        }catch(err){
            console.log("ERROR: accept organizer invitation - ", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);

//will join events
router.use("/eventJoin", eventJoinEndpoints);

export default router;