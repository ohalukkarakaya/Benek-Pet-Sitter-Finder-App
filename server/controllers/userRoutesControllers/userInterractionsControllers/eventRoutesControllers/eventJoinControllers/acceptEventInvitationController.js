import User from "../../../../../models/User.js";
import Event from "../../../../../models/Event/Event.js";
import EventTicket from "../../../../../models/Event/EventTicket.js";
import EventInvitation from "../../../models/Event/Invitations/InviteEvent.js";

import paramPayWithRegisteredCard from "../../../../../utils/paramRequests/paymentRequests/paramPayWithRegisteredCard.js";
import paramPayRequest from "../../../../../utils/paramRequests/paymentRequests/paramPayRequest.js";
import paramRegisterCreditCardRequest from "../../../utils/paramRequests/registerCardRequests/paramRegisterCreditCardRequest.js";
import paramAddDetailToOrder from "../../../../../utils/paramRequests/paymentRequests/paramAddDetailToOrder.js";
import paramsha2b64Request from "../../../../../utils/paramRequests/paramsha2b64Request.js";

import bcrypt from "bcrypt";
import crypto from "crypto";
import QRCode from "qrcode";
import dotenv from "dotenv";

dotenv.config();

const acceptEventInvitationController = async (req, res) => {
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

                const paramRegularPayRequest = await paramPayRequest(
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
                    !paramRegularPayRequest 
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
            const subsellerGuid = event.eventAdminsParamGuid;
            const paramAddDetailToOrderRequest = await paramAddDetailToOrder(
                price,
                priceForEventOwner,
                orderId,
                subsellerGuid
            );

            if( 
                !paramAddDetailToOrderRequest 
                || !paramAddDetailToOrderRequest
                || paramAddDetailToOrderRequest.error === true 
            ){
                return res.status( 500 ).json(
                    {
                        error: true,
                        message: "Internal server error"
                    }
                );
            }

        }

        const randPassword = crypto.randomBytes(10).toString('hex');

        //generate ticket
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashTicketPassword = await bcrypt.hash(randPassword, salt);
        const paidPrice = invitation.ticketPrice
                                    .price
                                    .toLocaleString( 'tr-TR' )
                                    .replace( '.', '' );

        await new EventTicket(
            {
                eventOrganizers: event.eventOrganizers,
                eventId: event._id.toString(),
                userId: req.user._id.toString(),
                ticketPassword: hashTicketPassword,
                paidPrice: paidPrice,
                orderId: orderId,
                orderInfo: {
                    pySiparisGuid: paramAddDetailToOrderRequest.data.PYSiparis_GUID,
                    sanalPosIslemId: paramAddDetailToOrderRequest.data.SanalPOS_Islem_ID,
                    subSellerGuid: paramAddDetailToOrderRequest.data.GUID_AltUyeIsyeri
                },
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

export default acceptEventInvitationController;