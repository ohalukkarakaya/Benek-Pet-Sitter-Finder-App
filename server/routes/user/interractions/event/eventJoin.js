import express from "express";
import User from "../../../../models/User.js";
import Event from "../../../../models/Event/Event.js";
import EventTicket from "../../../../models/Event/EventTicket.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import auth from "../../../../middleware/auth.js";
import QRCode from "qrcode";

dotenv.config();

const router = express.Router();

//will join event
router.post(
    "/:eventId",
    auth,
    async (req, res) => {
        try{
            if(!req.params.eventId){
                return res.status(400).json(
                    {
                        error: true,
                        message: "evetId is required"
                    }
                );
            }

            const event = await Event.findById(req.params.eventId);
            if(!event){
                return res.status(404).json(
                    {
                        error: true,
                        message: "Event not found"
                    }
                );
            }

            if( !( Date.parse(event.date) < Date.now() ) ){
                return res.status(403).json(
                    {
                        error: true,
                        message: "You can't plan to join event today or cancel ticket anymore"
                    }
                );
            }

            if(event.isPrivate){
                return res.status(401).json(
                    {
                        error: true,
                        message: "You can only join if you invented"
                    }
                );
            }

            if(event.maxGuests !== -1 && event.maxGuests <= event.willJoin.length){
                return res.json(
                    {
                        error: true,
                        message: "Guest quota exceeded"
                    }
                );
            }

            const isAllreadyJoined = event.willJoin.find(userId => userId === req.user._id.toString());

            if(isAllreadyJoined){
                await EventTicket.findOneAndDelete(
                    {
                        eventId: event._id.toString(),
                        userId: req.user._id.toString()
                    }
                );

                if(event.ticketPrice.priceType !== "Free" && event.ticketPrice.price !== 0){
                    //TO DO: cancel payment
                }

                event.willJoin = event.willJoin.filter(userId => userId !== req.user._id.toString());
                event.markModified("willJoin");
                event.save(
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
                        message: "Ticket removed and payment canceled succesfully"
                    }
                );
            }else{
                if(event.ticketPrice.priceType !== "Free" && event.ticketPrice.price !== 0){
                    //TO DO: payment will be here
                }

                const randPassword = Buffer.from(Math.random().toString()).toString("base64").substring(0,20);

                //generate ticket
                const salt = await bcrypt.genSalt(Number(process.env.SALT));
                const hashTicketPassword = await bcrypt.hash(randPassword, salt);

                await new EventTicket(
                    {
                        eventOrganizers: event.eventOrganizers,
                        eventId: event._id.toString(),
                        userId: req.user._id.toString(),
                        ticketPassword: hashTicketPassword,
                        eventDate: event.date,
                        expiryDate: event.expiryDate,
                        isPrivate: event.isPrivate
                    }
                ).save().then(
                    (ticket) => {
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
                                        return res.status(200).json(
                                            {
                                                error: false,
                                                message: `You bought a ticket for ${event._id} succesfully`,
                                                ticket: code.ticketUrl
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
                        );
                    }
                ).catch(
                    (err) => {
                        console.log(err);
                        return res.status(500).json(
                            {
                                error: true,
                                message: "Internal server error"
                            }
                        );
                    }
                );
            }
        }catch(err){
            console.log("ERROR: buy ticket - ", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);

export default router;