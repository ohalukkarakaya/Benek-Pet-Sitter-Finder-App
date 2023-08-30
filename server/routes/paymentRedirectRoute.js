import PaymentData from "../models/PaymentData/PaymentData.js";

import mokaAfter3dPaySuccesHelper from "../utils/mokaPosRequests/mokaHelpers/mokaAfter3dPaySuccesHelper.js";

import crypto from "crypto";
import express from "express";

const router = express.Router();

router.post(
    "/",
    async ( req, res ) => {
        try{
            const paymentUniqueId = req.body.OtherTrxCode.toString();
            const hashValue = req.body.hashValue.toString();
            const resultCode = req.body.resultCode.toString();
            const resultMessage = req.body.resultMessage.toString();
            const virtualPosOrderId = req.body.trxCode.toString();

            if(
                !paymentUniqueId
                || !hashValue
                || !virtualPosOrderId
            ){
                return res.status( 400 )
                          .json(
                            {
                                error: true,
                                message: "Missing Value Reached"
                            }
                          );
            }

            const paymentData = await PaymentData.findOne( { paymentUniqueCode: paymentUniqueId } );
            if( !paymentData ){
                return res.status( 404 )
                          .json(
                            {
                                error: true,
                                message: "Payment Not Found"
                            }
                          );
            }

            const codeForHash = paymentData.codeForHash
                                           .toUpperCase();

            const succesfulHash = crypto.createHash('sha256')
                                        .updata( `${codeForHash}T`, 'utf-8' )
                                        .digest('hex');

            const failHash = crypto.createHash('sha256')
                                   .updata( `${codeForHash}F`, 'utf-8' )
                                   .digest('hex');

            const isSuccesful = hashValue === succesfulHash;
            const isFail = hashValue === failHash;

            if( isSuccesful ){
                paymentData.isPaid = true,
                paymentData.virtualPosOrderId = virtualPosOrderId;

                const paidPrice = `${ parseFloat( paymentData.priceData.price ) } ${ paymentData.priceData.priceType }`;

                paymentData.markModified( "isPaid" );
                paymentData.markModified( "virtualPosOrderId" );
                paymentData.save(
                    ( err ) => {
                        if( err ){
                            return res.status( 500 )
                                      .json(
                                          {
                                              error: true,
                                              message: "ERROR: while saving paymentData",
                                              errorData: err
                                          }
                                      );
                        }
                    }
                );
                
                const prepareTicket = await mokaAfter3dPaySuccesHelper( paymentData );

                return res.status( 200 )
                          .json(
                            {
                                error: false,
                                serverStatus: 1,
                                message: `You accepted the invitation for event with "${mentionedEvent._id}" id succesfully`,
                                payData: paidPrice,
                                ticket: prepareTicket.ticket

                            }
                          );

            }else if( isFail ){
                return res.status( 400 )
                          .json(
                            {
                                error: true,
                                resultCode: resultCode,
                                message: resultMessage
                            }
                          );
            }else{
                console.log( "ERROR: unexpected - paymentRedirectRoute - ", resultMessage );
                return res.status( 500 )
                          .json(
                            {
                                error: true,
                                message: "Internal Server Error"
                            }
                          );
            }

        }catch( err ){
            console.log( "ERROR: paymentRedirectRoute - ", err );
            return res.status( 500 )
                      .json(
                        {
                            error: true,
                            message: "Internal Server Error"
                        }
                      );
        }
    }
);

export default router;