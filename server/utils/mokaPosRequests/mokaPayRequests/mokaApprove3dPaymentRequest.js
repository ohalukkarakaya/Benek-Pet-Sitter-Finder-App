import mokaCredentialsHelper from "../mokaHelpers/mokaCredentialsHelper.js";
import expenseDocumentGenerationHelper from "../mokaHelpers/expenseDocumentGenerationHelper.js";

import https from "https";
import crypto from "node:crypto";
import axios from "axios";
import dotenv from "dotenv";
import PaymentData from "../../../models/PaymentData/PaymentData.js";

dotenv.config();
const env = process.env;

const mokaApprove3dPaymentRequest = async (
    careGiverMokaId,
    virtualPosOrderId,
    res
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
                url: `${ env.MOKA_TEST_URL_BASE }/PaymentDealer/DoApprovePoolPayment`,
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
                    return reject(
                        {
                            error: true,
                            serverStatus: -1,
                            message: `Api error: ${ responseData.status }, Server Message: ${ returnedResponse.ResultCode }`
                        }
                    );
                }
                let paymentDataToReturn;

                const paymentData = await PaymentData.findOne({ virtualPosOrderId: virtualPosOrderId });
                paymentDataToReturn = paymentData.toObject();

                const expenseRegistration =  await expenseDocumentGenerationHelper( paymentData, res );
                if( expenseRegistration.error ){
                    return reject(
                        {
                            error: true,
                            serverStatus: -1,
                            message: "Expense Registration Error"
                        }
                    );
                }

                let expenseRecordId = expenseRegistration.data.expenseRecordId;

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
                        threeDPayData: threeDPayData,
                        paymentData: paymentDataToReturn,
                        expenseRecordId: expenseRecordId,
                    }
                }
                
                return resolve( response );
            }catch( err ){
                console.log( "ERROR: mokaApprove3dPaymentRequest - ", err );
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

export default mokaApprove3dPaymentRequest;