import PaymentData from "../models/PaymentData/PaymentData.js";

import mokaAfter3dPaySuccesHelper from "../utils/mokaPosRequests/mokaHelpers/mokaAfter3dPaySuccesHelper.js";

import crypto from "crypto";
import express from "express";

const router = express.Router();

import dotenv from "dotenv";

dotenv.config();

// - tested
router.post(
    "/", 
    async ( req, res ) => {
    try{
        const {
            OtherTrxCode,
            hashValue,
            resultMessage,
            trxCode
        } = req.body;

        const paymentUniqueId = OtherTrxCode.toString();
        const virtualPosOrderId = trxCode.toString();

        if(
            !paymentUniqueId 
            || !hashValue 
            || !virtualPosOrderId
        ){
            return res.redirect( `${process.env.BASE_URL}/api/paymentRedirect?isSuccess=false` );
        }

        const paymentData = await PaymentData.findOne({ paymentUniqueCode: paymentUniqueId });

        if( !paymentData ){
            return res.redirect( `${process.env.BASE_URL}/api/paymentRedirect?isSuccess=false` );
        }

        const codeForHash = paymentData.codeForHash
                                       .toUpperCase();

        const succesfulHash = crypto.createHash( 'sha256' )
                                    .update( `${codeForHash}T`, 'utf-8' )
                                    .digest( 'hex' );

        const failHash = crypto.createHash( 'sha256' )
                               .update( `${codeForHash}F`, 'utf-8' )
                               .digest( 'hex' );

        const isSuccesful = hashValue === succesfulHash;
        const isFail = hashValue === failHash;

        let redirectUrl;

        if( isSuccesful ){
            paymentData.isPaid = true;
            paymentData.virtualPosOrderId = virtualPosOrderId;

            paymentData.markModified( "isPaid" );
            paymentData.markModified( "virtualPosOrderId" );

            let prepareTicket = await mokaAfter3dPaySuccesHelper( virtualPosOrderId, paymentData );

            if (
                prepareTicket
                && paymentData.isFromInvitation
            ){
                paymentData.parentContentId = prepareTicket.ticketId;
                paymentData.isFromInvitation = false;

                paymentData.markModified( "parentContentId" );
                paymentData.markModified( "isFromInvitation" );
                
            }

            await paymentData.save();

            redirectUrl = `${process.env.BASE_URL}/api/paymentRedirect?isSuccess=true&ticketId=${prepareTicket.ticketId.toString()}`;

        }else if( isFail ){
            redirectUrl = `${process.env.BASE_URL}/api/paymentRedirect?isSuccess=false`;
        }else{
            console.log( "ERROR: unexpected - paymentRedirectRoute - ", resultMessage );
            redirectUrl = `${process.env.BASE_URL}?isSuccess=false`;
        }

        return res.redirect( redirectUrl );

    }catch( err ){
        console.log("ERROR: paymentRedirectRoute - ", err);
        const redirectUrl = `${process.env.BASE_URL}/api/paymentRedirect?isSuccess=false`;
        return res.redirect(redirectUrl);
    }
});

// - tested
router.get(
    "/",
    async ( req, res ) => {
        const isSuccess = req.query.isSuccess === 'true';
        const ticketId = req.query.ticketId;

        if( isSuccess ){
            return res.status( 200 )
                      .json(
                        {
                            error: false,
                            message: "İşlem Başarılı, Yönlendiriliyorsunuz",
                            ticketId: ticketId
                        }
                      );
        }else{
            return res.status( 500 )
                      .json(
                            {
                                error: true,
                                message: "İşlem Başarısız, Yönlendiriliyorsunuz",
                                ticketId: null
                            }
                      );
        }
    }
);

export default router;