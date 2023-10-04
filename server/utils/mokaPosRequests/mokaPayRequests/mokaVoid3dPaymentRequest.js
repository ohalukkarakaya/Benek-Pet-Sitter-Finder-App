import mokaCredentialsHelper from "../mokaHelpers/mokaCredentialsHelper.js";

import https from "https";
import crypto from "node:crypto";
import axios from "axios";
import dotenv from "dotenv";

import PaymentData from "../../../models/PaymentData/PaymentData.js";

import mokaValidateHourForVoidPaymentHelper from "../mokaHelpers/mokaValidateHourForVoidPaymentHelper.js";

dotenv.config();
const env = process.env;

const mokaVoid3dPaymentRequest = async ( virtualPosOrderId ) => {
    return new Promise(
        async (
            resolve,
            reject
        ) => {
            const mokaCredentials = mokaCredentialsHelper();

            const paymentData = await PaymentData.findOne({ virtualPosOrderId: virtualPosOrderId });
            if( !paymentData ){ reject({ error: true, serverStatus: -1, message: `PaymentData Not Found` }); }

            const isTimeValid = mokaValidateHourForVoidPaymentHelper( paymentData.createdAt );

            let paymentDealerRequest = {
                "VirtualPosOrderId": virtualPosOrderId,
                "ClientIP": isTimeValid ? process.env.MOKA_CLIENT_IP_FOR_TEST : undefined,
                "VoidRefundReason": isTimeValid ? 2 : undefined,
                "Amount": isTimeValid ? undefined : paymentData.priceData.price,
                "SubDealer": isTimeValid
                                ? undefined 
                                : [
                                    { 
                                        "DealerId": paymentData.subSellerGuid, 
                                        "Amount": paymentData.priceData.price
                                    }
                                ]
            };

            
            const data = {
                "PaymentDealerAuthentication": mokaCredentials,
                "PaymentDealerRequest": paymentDealerRequest

            }

            const apiUrlEnd = isTimeValid ? "DoVoid" : "DoCreateRefundRequest";

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: isT `${ env.MOKA_TEST_URL_BASE }/PaymentDealer/${ apiUrlEnd }`,
                headers: { 'Content-Type': 'application/json' },
                httpsAgent: new https.Agent( { secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT } ),
                data: data
            };

            try{
                let response
                const responseData = await axios.request( config );

                const returnedResponse = responseData.data;
                if(
                    !responseData
                    || responseData.status !== 200
                    || returnedResponse.ResultCode !== "Success"
                ){
                    if(
                        returnedResponse.ResultCode === 'PaymentDealer.DoVoid.PaymentNotFound'
                        || returnedResponse.ResultCode === 'PaymentDealer.DoVoid.PaymentNotAvailable'
                    ){
                        await paymentData.deleteOne();
                        resolve(
                            {
                                error: true,
                                serverStatus: 0,
                                message: "payment doesn't need to cancel"
                            }
                        )
                    }
                    reject(
                        {
                            error: true,
                            serverStatus: -1,
                            message: `Api error: ${ responseData.status }, Server Message: ${ returnedResponse.ResultCode }`
                        }
                    );
                }

                let sonuc = returnedResponse.ResultCode === "Success"
                                ? 1
                                : -1;

                let sonucStr = returnedResponse.ResultCode;
                let threeDCancelData = returnedResponse.Data;

                response = {
                    error: false,
                    data: {
                        sonuc: sonuc,
                        sonucStr: sonucStr,
                        threeDCancelData: threeDCancelData
                    }
                }
                
                await paymentData.deleteOne();
                resolve( response );
            }catch( err ){
                console.log( "ERROR: mokaVoid3dPaymentRequest - ", err );
                reject(
                    {
                        error: true,
                        serverStatus: -1,
                        message: "Internal Server Error",
                    }
                );
            }
        }
    );
}

export default mokaVoid3dPaymentRequest;