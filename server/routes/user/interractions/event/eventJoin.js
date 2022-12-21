import express from "express";
import User from "../../../../models/User.js";
import Event from "../../../../models/Event/Event.js";
import EventTicket from "../../../../models/Event/EventTicket.js";
import EventInvitation from "../../../../models/Event/Invitations/InviteEvent.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import auth from "../../../../middleware/auth.js";
import QRCode from "qrcode";

dotenv.config();

const router = express.Router();

//invite to private event
router.post(
    "invitation/:eventId/:invitedUserId",
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

            const invitedUser = await User.findById(req.params.invitedUserId);
            if(!invitedUser){
                return res.status(404).json(
                    {
                        error: true,
                        message: "User not found"
                    }
                );
            }

            const isAdmin = req.user._id.toString === event.eventAdmin;
            const isOrganizer = event.eventOrganizers.find(userId => userId === req.user._id);
            const isPrivate = event.isPrivate;

            if(
                isPrivate && !isAdmin
                || !isPrivate && !isAdmin && !isOrganizer
            ){
                return res.status(401).json(
                    {
                        error: true,
                        message: "You are not authorized to invite any user to this event"
                    }
                );
            }

            if(event.date <= Date.now()){
                return res.status(400).json(
                    {
                        error: true,
                        message: "Event is expired"
                    }
                );
            }

            if(event.maxGuests !== -1 && event.maxGuests <= event.willJoin.length){
                return res.status(400).json(
                    {
                        error: true,
                        message: "Guest quota exceeded"
                    }
                );
            }
            
            const isUserAlreadyJoining = event.willJoin.find( userId => userId === req.user._id.toString() );
            if(isUserAlreadyJoining){
                return res.status(400).json(
                    {
                        error: true,
                        message: "invited user is already participant of event"
                    }
                );
            }

            const areThereAnyPastInvitation = await EventInvitation.findOne(
                {
                    eventId: event._id.toString(),
                    invitedId: req.user._id.toString()
                }
            );
            if(areThereAnyPastInvitation){
                return res.status(400).json(
                    {
                        error: true,
                        message: "User already Invited"
                    }
                );
            }

            await new EventInvitation(
                {
                    eventAdminId: event.eventAdmin,
                    eventId: event._id.toString(),
                    invitedId: invitedUser._id.toString(),
                    ticketPrice: event.ticketPrice,
                    eventDate: event.date,
                    isPrivate: event.isPrivate
                }
            ).save().then(
                (invitation) => {
                    return res.status(200).json(
                        {
                            error: false,
                            message: `User ${invitation.invitedId} invited succesfully`
                        }
                    );
                }
            ).catch(
                (error) => {
                    console.log(error);
                    return res.status(500).json(
                        {
                            error: true,
                            messaage: "Internal server error"
                        }
                    );
                }
            );

            
        }catch(err){
            console.log("ERROR: invite to event - ", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);

//accept invitation
router.put(
    "/invitation/:invitationId/:response",
    auth,
    async(req, res) => {
        try{
            const response = req.params.response === "true";
            if(
                !req.params.invitationId
                || !req.params.response !== Boolean
            ){
                return res.status(400).json(
                    {
                        error: true,
                        message: "Missing or wrong parameter"
                    }
                );
            }

            const invitation = await EventInvitation.findById(req.params.invitationId);
            if(!invitation){
                return res.status(404).json(
                    {
                        error: true,
                        message: "Invitation not found"
                    }
                );
            }

            if(invitation.invitedId !== req.user._id.toString()){
                return res.status(401).json(
                    {
                        error: true,
                        message: "this is not your invitation"
                    }
                );
            }

            const event = await Event.findById(invitation.eventId);
            const isAlreadyJoined = event.willJoin.find(userId => userId === req.user._id.toString());
            if(
                isAlreadyJoined
                || !response
                || !event
                || event.date <= Date.now()
                || event.maxGuests <= event.willJoin.length
            ){
                await invitation.deleteOne().then(
                    (_) => {
                        if(!response){
                            return res.status(500).json(
                                {
                                    error: true,
                                    message: "Invitation rejected succesfully"
                                }
                            );
                        }else{
                            if(isAlreadyJoined){
                                return res.status(400).json(
                                    {
                                        error: true,
                                        message: "You are already participant of the event"
                                    }
                                );
                            }else{
                                return res.status(500).json(
                                    {
                                        error: true,
                                        message: "Invitation is invalid"
                                    }
                                );
                            }
                        }
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
                    paidPrice: event.ticketPrice,
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
                                    invitation.deleteOne().then(
                                        (_) => {
                                            return res.status(200).json(
                                                {
                                                    error: false,
                                                    message: `You accepted the invitation for event with "${event._id}" id succesfully`,
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
        }catch(err){
            console.log("ERROR: accept invitation - ", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);

//buy ticket for event
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

            if( event.date <= Date.now() ){
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
                        message: "You can join only if you invented"
                    }
                );
            }

            const isAllreadyJoined = event.willJoin.find(userId => userId === req.user._id.toString());

            if(!isAllreadyJoined && event.maxGuests !== -1 && event.maxGuests <= event.willJoin.length){
                return res.json(
                    {
                        error: true,
                        message: "Guest quota exceeded"
                    }
                );
            }

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
                        paidPrice: event.ticketPrice,
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

//use ticket
router.put(
    "/:eventId",
    auth,
    async (req, res) => {
        try{
            const eventId = req.params.eventId;
            const ticketId = req.body.tcketId;
            const ticketOwnerId = req.body.ticketOwnerId;
            const ticketPassword = req.body.ticketPassword;

            if(
                !eventId
                || ticketId
                || ticketOwnerId
                || ticketPassword
            ){
                return res.status(400).json(
                    {
                        error: true,
                        message: "missing param"
                    }
                );
            }
            const meetingEvent = await Event.findById(req.params.eventId);
            if(!meetingEvent){
                return res.status(404).json(
                    {
                        error: true,
                        message: "event not found"
                    }
                );
            }
            
            const ticket = await EventTicket.findById(ticketId);
            if(!ticket){
                return res.status(404).json(
                    {
                        error: true,
                        message: "ticket not found"
                    }
                );
            }

            if(ticket.eventOrganizers  !== meetingEvent.eventOrganizers){
                ticket.eventOrganizers = meetingEvent.eventOrganizers;
                ticket.markModified("eventOrganizers");
            }
            const isEventToday = meetingEvent.date !== Date.now();
            const isOrganizer = meetingEvent.eventOrganizers.find( userId => userId === req.user._id );

            if( ticket.eventId !== event._id.toString() ){
                return res.status(401).json(
                    {
                        error: true,
                        message: "wrong event"
                    }
                );
            }
            
            const isUserInGuestList = meetingEvent.willJoin.find(userId => userId.toString() === ticket.userId.toString());
            if(!isUserInGuestList){
                return res.status(403).json(
                    {
                        error: true,
                        message: "Unexpected guest"
                    }
                );
            }

            const ticketOwner = await User.findById(ticket.userId);
            if(!ticketOwner){
                ticket.deleteOne().then(
                    (_) => {
                        return res.status(500).json(
                            {
                                error: true,
                                message: `User with the id "${ticketOwner._id}" not found therefore ticket has been terminated`
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

            if(!isEventToday){
                return res.status(401).json(
                    {
                        error: true,
                        message: "Event is not today"
                    }
                );
            }

            if(!isOrganizer){
                return res.status(403).json(
                    {
                        error: true,
                        message: "You are not authorized to accept tickets"
                    }
                );
            }

        }catch(err){
            console.log("ERROR: use ticket - ", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }

        const verifiedPassword = await bcrypt.compare(
            ticketPassword,
            ticket.ticketPassword
        );
        if(!verifiedPassword){
            return res.status(403).json(
                {
                    error: true,
                    message: "Invlid ticket"
                }
            );
        }

        meetingEvent.willJoin = meetingEvent.willJoin.filter( userId => userId !== ticket.userId.toString() );
        meetingEvent.markModified("willJoin");
        
        meetingEvent.joined.push( ticket.userId.toString() );
        meetingEvent.markModified("joined");

        meetingEvent.save().then(
            (_) => {
                if(meetingEvent.ticketPrice.priceType !== "Free" && meetingEvent.ticketPrice.price !== 0){
                    //TO DO: payment approvement will be here
                }

                ticket.deleteOne().then(
                    (_) => {
                        return res.status(200).json(
                            {
                                error: false,
                                message: `You accepted the ticket of the user whose id is "${ticketOwner._id}", succesfully`,
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

export default router;