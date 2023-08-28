import mokaCredentialsHelper from "../mokaHelpers/mokaCredentialsHelper.js";

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const env = process.env;

const mokaReject3dPaymentRequest = async (
    careGiverMokaId,
    virtualPosOrderId
) => {
    return new Promise(
        async (
            resolve,
            reject
        ) => {
            const mokaCredentials = mokaCredentialsHelper();

            let paymentDealerRequest = {
                "VirtualPosOrderId": virtualPosOrderId,
                "SubDealer": [
                    {
                        "DealerId": careGiverMokaId
                    }
                ]
            };

            
            const data = {
                "PaymentDealerAuthentication": mokaCredentials,
                "PaymentDealerRequest": paymentDealerRequest

            }

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${ env.MOKA_TEST_URL_BASE }/PaymentDealer/UndoApprovePoolPayment`,
                headers: { 'Content-Type': 'application/json' },
                data: data
            };

            try{
                let response
                const responseData = await axios.request( config );

                const returnedResponse = JSON.stringify( responseData.data );
                if(
                    !responseData
                    || responseData.status !== 200
                    || returnedResponse.ResultCode !== "Success"
                ){
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
                let threeDPayData = returnedResponse.Data;

                response = {
                    error: false,
                    data: {
                        sonuc: sonuc,
                        sonucStr: sonucStr,
                        threeDPayData: threeDPayData
                    }
                }
                
                resolve( response );
            }catch( err ){
                console.log( "ERROR: mokaReject3dPaymentRequest - ", err );
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

export default mokaReject3dPaymentRequest;