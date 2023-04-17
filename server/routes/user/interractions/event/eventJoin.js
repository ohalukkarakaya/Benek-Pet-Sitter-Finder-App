import express from "express";
import User from "../../../../models/User.js";
import Event from "../../../../models/Event/Event.js";
import EventTicket from "../../../../models/Event/EventTicket.js";
import EventInvitation from "../../../../models/Event/Invitations/InviteEvent.js";

import bcrypt from "bcrypt";
import crypto from "crypto";
import dotenv from "dotenv";

import auth from "../../../../middleware/auth.js";
import QRCode from "qrcode";

import paramPayWithRegisteredCard from "../../../../utils/paramRequests/paymentRequests/paramPayWithRegisteredCard.js";
import paramPayRequest from "../../../../utils/paramRequests/paymentRequests/paramPayRequest";
import paramRegisterCreditCardRequest from "../../../../utils/paramRequests/registerCardRequests/paramRegisterCreditCardRequest.js";
import paramsha2b64Request from "../../../../utils/paramRequests/paramsha2b64Request.js";

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
            if(!invitedUser || invitedUser.deactivation.isDeactive){
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
            let orderId;
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
            const isAlreadyJoined = event.willJoin.find( userId => userId === req.user._id.toString() );
            if(
                isAlreadyJoined
                || !response
                || !event
                || event.date <= Date.now()
                || event.maxGuests <= event.willJoin.length
            ){
                await invitation.deleteOne().then(
                    (_) => {
                        if( !response ){
                            return res.status(500).json(
                                {
                                    error: true,
                                    message: "Invitation rejected succesfully"
                                }
                            );
                        }else{
                            if( isAlreadyJoined ){
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

            if(invitation.ticketPrice.priceType !== "Free" && invitation.ticketPrice.price !== 0){
                var recordCard = true;

                let cardGuid;

                cardGuid = req.body.cardGuid.toString();
                const cardNo = req.body.cardNo.toString();
                const cvv = req.body.cvv.toString();
                const cardExpiryDate = req.body.cardExpiryDate.toString();
                const user = await User.findById( req.user._id.toString() );

                const price = invitation.ticketPrice
                                        .price
                                        .toLocaleString( 'tr-TR' )
                                        .replace( '.', '' );

                const priceForEventOwner = (
                                            invitation.ticketPrice
                                                      .price - ( 
                                                                 invitation.ticketPrice
                                                                           .price * 100 
                                                               ) / 15
                                           ).toLocaleString( 'tr-TR' )
                                            .replace( '.', '' );

                if( !user.phone ){
                    return res.status( 400 ).json(
                        {
                            error: true,
                            message: "user doesn't have phone number inserted"
                        }
                    );
                }
                var phoneNumberWithoutZero = user.phone.replace(/\D/g, '').slice(-10);

                //take payment
                if( req.body.recordCard && req.body.recordCard === false ){
                    recordCard = false;
                }

                if( 
                    cardGuid 
                    || (
                        recordCard
                        && cardNo
                        && cvv
                        && cardExpiryDate
                    )
                ){
                    if(
                        !cardGuid
                        && recordCard
                        && cardNo
                        && cvv
                        && cardExpiryDate
                    ){
                        const cardName = user.userName + crypto.randomBytes(6).toString('hex');
                        //register card
                        const registerCardRequest = await paramRegisterCreditCardRequest(
                            user.identity.firstName, //firstname
                            user.identity.middleName, //middlename
                            user.identity.lastName, //lastname
                            cardNo, //card no
                            cardExpiryDate.split("/")[0], //expiry date month
                            cardExpiryDate.split("/")[1], //expiry date year
                            cardName // random card name to keep it
                        );

                        if( !registerCardRequest || registerCardRequest.error === true ){
                            return res.status(500).json(
                                {
                                    error: true,
                                    message: "error while registering card"
                                }
                            );
                        }

                        cardGuid = registerCardRequest.data.ksGuid;

                        user.cardGuidies.push(
                            {
                                cardName: cardName,
                                cardGuid: cardGuid
                            }
                        );
                        
                        user.markModified("cardGuidies");
                        user.save(
                            (err) => {
                                if(err){
                                    console.log(err);
                                }
                            }
                        );
                    }

                    const payWithRegisteredCardRequest = await paramPayWithRegisteredCard(
                        cardGuid, //kkGuid
                        cvv, //cvv
                        phoneNumberWithoutZero,//phone number
                        "https://dev.param.com.tr/tr", //success url
                        "https://dev.param.com.tr/tr", //error url
                        invitation._id, //order Id
                        event.desc, //order desc
                        price,
                        priceForEventOwner,
                        'NS', //payment type
                        'https://dev.param.com.tr/tr' // ref url
                    );
                    
                    if( !payWithRegisteredCardRequest || payWithRegisteredCardRequest.error === true ){
                        //To Do: Check payment data
                        return res.status(500).json(
                            {
                                error: true,
                                message: "error paying with registered card"
                            }
                        );
                    }
                    //set order id
                    orderId = payWithRegisteredCardRequest.data.islemID;
                } else if(
                    !cardGuid 
                    && !recordCard
                    && cardNo
                    && cvv
                    && cardExpiryDate
                ){
                    const shaData = process.env.PARAM_CLIENT_CODE 
                                    + process.env.PARAM_GUID 
                                    + 1 
                                    + price 
                                    + priceForEventOwner
                                    + invitation._id;

                    // take payment regularly
                    const sha2b64Request = await paramsha2b64Request( shaData );
                    if( 
                        !sha2b64Request 
                        || sha2b64Request.error === true 
                        || !( sha2b64Request.data.sha2b64result ) 
                    ){
                        return res.status( 500 ).json(
                            {
                                error: true,
                                message: "error on sha2b64 crypto api"
                            }
                        );
                    } 

                    const payRequest = await paramPayRequest(
                        user.identity.firstName, //firstname
                        user.identity.middleName, //middlename
                        user.identity.lastName, //lastname
                        price,
                        priceForEventOwner,
                        cardNo,
                        cardExpiryDate.split("/")[0],
                        cardExpiryDate.split("/")[1],
                        cvv,
                        phoneNumberWithoutZero,
                        "https://dev.param.com.tr/tr", //success url
                        "https://dev.param.com.tr/tr", //error url
                        invitation._id,
                        event.desc, //order desc
                        sha2b64Request.data.sha2b64result.toString(),
                        "NS",
                        'https://dev.param.com.tr/tr' // ref url
                    );

                    if( 
                        !payRequest 
                        || payRequest.error === true 
                        || !( payRequest.data.islemId ) 
                    ){
                        return res.status( 500 ).json(
                            {
                                error: true,
                                message: "error on pay request"
                            }
                        );
                    }

                    orderId = payRequest.data.islemId;
                }else{
                    return res.status( 400 ).json(
                        {
                            error: true,
                            message: "Missing payment info"
                        }
                    );
                }

                if( !orderId ){
                    return res.status( 500 ).json(
                        {
                            error: true,
                            message: "Internal server error"
                        }
                    );
                }

                //add order detail
            }

            const randPassword = crypto.randomBytes(10).toString('hex');

            //generate ticket
            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashTicketPassword = await bcrypt.hash(randPassword, salt);

            await new EventTicket(
                {
                    eventOrganizers: event.eventOrganizers,
                    eventId: event._id.toString(),
                    userId: req.user._id.toString(),
                    ticketPassword: hashTicketPassword,
                    paidPrice: invitation.ticketPrice,
                    orderId: orderId,
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
            if(!ticketOwner || ticketOwner.deactivation.isDeactive){
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