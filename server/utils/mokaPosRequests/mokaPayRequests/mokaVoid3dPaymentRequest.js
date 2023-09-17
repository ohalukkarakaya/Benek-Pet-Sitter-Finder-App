import mokaCredentialsHelper from "../mokaHelpers/mokaCredentialsHelper.js";

import https from "https";
import crypto from "node:crypto";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const env = process.env;

const mokaVoid3dPaymentRequest = async ( virtualPosOrderId ) => {
    return new Promise(
        async (
            resolve,
            reject
        ) => {
            const mokaCredentials = mokaCredentialsHelper();

            let paymentDealerRequest = {
                "VirtualPosOrderId": virtualPosOrderId,
                "ClientIP": process.env.MOKA_CLIENT_IP_FOR_TEST,
                "VoidRefundReason": 2
            };

            
            const data = {
                "PaymentDealerAuthentication": mokaCredentials,
                "PaymentDealerRequest": paymentDealerRequest

            }

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${ env.MOKA_TEST_URL_BASE }/PaymentDealer/DoVoid`,
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