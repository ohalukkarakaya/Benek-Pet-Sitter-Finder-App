import PaymentData from "../../models/PaymentData/PaymentData.js";

import crypto from "crypto";
import dotenv from "dotenv";

import mokaAfter3dPaySuccesHelper from "../../utils/mokaPosRequests/mokaHelpers/mokaAfter3dPaySuccesHelper.js";

dotenv.config();

const threeDRedirectRouteController = async ( req, res ) => {
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
            return res.redirect( `${process.env.BASE_URL}/api/payment/redirect?isSuccess=false` );
        }

        const paymentData = await PaymentData.findOne({ paymentUniqueCode: paymentUniqueId });

        if( 
            !paymentData
            || paymentData.isPaid
        ){
            return res.redirect( `${process.env.BASE_URL}/api/payment/redirect?isSuccess=false&alreadyPaid=true` );
        }

        const codeForHash = paymentData.codeForHash.toUpperCase();
        const succesfulHash = crypto.createHash( 'sha256' ).update( `${codeForHash}T`, 'utf-8' ).digest( 'hex' );
        const failHash = crypto.createHash( 'sha256' ).update( `${codeForHash}F`, 'utf-8' ).digest( 'hex' );

        const isSuccesful = hashValue === succesfulHash;
        const isFail = hashValue === failHash;

        let redirectUrl;

        if( isSuccesful ){
            paymentData.isPaid = true;
            paymentData.virtualPosOrderId = virtualPosOrderId;

            paymentData.markModified( "isPaid" );
            paymentData.markModified( "virtualPosOrderId" );

            let prepareTicket = await mokaAfter3dPaySuccesHelper( virtualPosOrderId, paymentData );

            if ( prepareTicket && paymentData.isFromInvitation ){
                paymentData.parentContentId = prepareTicket.ticketId;
                paymentData.isFromInvitation = false;

                paymentData.markModified( "parentContentId" );
                paymentData.markModified( "isFromInvitation" );
                
            }

            await paymentData.save();
            redirectUrl = `${process.env.BASE_URL}/api/payment/redirect?isSuccess=true&ticketId=${ prepareTicket.ticketId.toString() }`;

        }else if( isFail ){

            await paymentData.deleteOne();
            redirectUrl = `${process.env.BASE_URL}/api/payment/redirect?isSuccess=false`;
        }else{

            console.log( "ERROR: unexpected - paymentRedirectRoute - ", resultMessage );
            redirectUrl = `${process.env.BASE_URL}/api/payment/redirect?isSuccess=false`;
        }

        return res.redirect( redirectUrl );

    }catch( err ){
        console.log("ERROR: paymentRedirectRoute - ", err);
        const redirectUrl = `${process.env.BASE_URL}/api/payment/redirect?isSuccess=false`;
        return res.redirect(redirectUrl);
    }
}

export default threeDRedirectRouteController;