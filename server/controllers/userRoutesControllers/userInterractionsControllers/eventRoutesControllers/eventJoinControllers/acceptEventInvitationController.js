import User from "../../../../../models/User.js";
import Event from "../../../../../models/Event/Event.js";
import EventInvitation from "../../../../../models/Event/Invitations/InviteEvent.js";
import PaymentData from "../../../../../models/PaymentData/PaymentData.js";

import mokaCreatePaymentHelper from "../../../../../utils/mokaPosRequests/mokaHelpers/mokaCreatePaymentHelper.js";
import prepareEventTicketHelper from "../../../../../utils/prepareEventTicketHelper.js";
import dotenv from "dotenv";

dotenv.config();

const acceptEventInvitationController = async ( req, res ) => {
    try {
        const response = req.params.response === "true";
        if(
            !req.params.invitationId 
            || typeof response !== 'boolean'
        ){
            return res.status( 400 ).json({ error: true, message: "Missing or wrong parameter" });
        }

        const invitation = await EventInvitation.findById( req.params.invitationId );
        if( !invitation ){
            return res.status( 404 ).json({ error: true, message: "Invitation not found" });
        }

        if(
            invitation.invitedId !== req.user._id.toString()
        ){
            return res.status( 401 ).json({ error: true, message: "This is not your invitation" });
        }

        const event = await Event.findById( invitation.eventId );
        const isAlreadyJoined = event.willJoin.includes( req.user._id.toString() );

        if(
            isAlreadyJoined 
            || !response 
            || !event 
            || event.date <= Date.now() 
            || (
                event.maxGuests !== -1 
                && event.maxGuests <= event.willJoin.length
            )
        ) {
            await invitation.deleteOne();

            if( !response ){
                return res.status( 500 ).json({ error: true, message: "Invitation rejected successfully" });
            }else{
                if( isAlreadyJoined ){
                    return res.status( 400 ).json({ error: true, message: "You are already a participant of the event" });
                }else{
                    return res.status( 500 ).json({ error: true, message: "Invitation is invalid" });
                }
            }
        }

        const didAlreadyPaid = await PaymentData.findOne({ parentContentId: req.params.invitationId.toString() });
        if( didAlreadyPaid ){
            return res.status( 200 ).json({
                error: false,
                message: "Already Paid",
                payData: {
                    paymentDataId: didAlreadyPaid._id.toString(),
                    paymentUniqueCode: didAlreadyPaid.paymentUniqueCode,
                    threeDUrl: didAlreadyPaid.threeDUrl,
                },
                ticket: null
            });
        }

        if(
            invitation.ticketPrice.priceType !== "Free" 
            && invitation.ticketPrice.price !== 0
        ){
            const cardGuid = req.body.cardGuid 
                                ? req.body.cardGuid.toString() 
                                : null;

            const cardNo = req.body.cardNo.toString();
            const cvv = req.body.cvv.toString();
            const cardExpiryDate = req.body.cardExpiryDate.toString();
            const userId = req.user._id.toString();
            const price = parseFloat( invitation.ticketPrice.price );

            const redirectUrl = process.env.BASE_URL + "/api/payment/redirect";

            const paymentData = await mokaCreatePaymentHelper(
                userId, //customer user id
                cardGuid, //card guid
                cardNo, //card number
                cardExpiryDate.split("/")[0], //card expiry month
                cardExpiryDate.split("/")[1], //card expiry year
                cvv, //card cvv
                invitation._id.toString(), //parent id
                null, //productDesc
                "EventTicket", //payment type
                null,
                invitation.eventAdminId, //caregiver id
                ( await User.findById( invitation.eventAdminId ) ).careGiveGUID, //caregiver guid
                price, // amount
                redirectUrl,
                req.body.recordCard === 'true',
                true // is from invitation
            );

            if( paymentData.message === 'Daily Limit Exceeded' ){
                return res.status( 500 ).json({
                    error: true,
                    message: "Daily Limit Exceeded",
                    payError: paymentData
                });
            }

            if(
                !paymentData 
                || paymentData.error 
                || paymentData.serverStatus !== 1 
                || !paymentData.payData 
                || paymentData.payData === null 
                || paymentData.payData === undefined
            ){
                return res.status( 500 ).json({
                    error: true,
                    message: "Error While Payment",
                    payError: paymentData
                });
            }

            return res.status( 200 ).json({
                error: false,
                message: "Waiting for 3d payment approve",
                payData: paymentData.payData,
                ticket: null
            });
        }

        const careGiver = await User.findById( invitation.eventAdminId );
        if( !careGiver || careGiver.deactivation.isDeactive ){
            return res.status( 404 ).json({ error: true, message: "CareGiver not Found" });
        }

        const eventTicketData = await prepareEventTicketHelper(
            req.user._id.toString(), //customer userId
            req.params.invitationId, //eventInvitation Id
            null, //event Id
            "Free_Event", //virtualPosOrderId
            careGiver.careGiveGUID, //care Giver guid
            "Free_Event" // payment unique code
        );

        if(
            !eventTicketData
            || eventTicketData.error
        ){
            return res.status( 500 ).json({ error: true, message: "Internal Server Error" });
        }

        return res.status( 200 ).json( eventTicketData );
    }catch( err ){
        console.log( "ERROR: accept invitation - ", err );
        return res.status( 500 ).json({ error: true, message: "Internal server error" });
    }
}

export default acceptEventInvitationController;
