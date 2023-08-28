import mokaCredentialsHelper from "../mokaHelpers/mokaCredentialsHelper.js";

import axios from "axios";
import dotenv from "dotenv";
import doesStringValueExistHelper from "../../doesStringValueExistHelper.js";

dotenv.config();
const env = process.env;

const mokaCreate3dPaymentRequest = async (
    cardToken,
    firstName,
    middleName,
    lastName,
    cardNumber,
    cardExpMonth,
    cardExpYear,
    cardCvcNumber,
    amount,
    otherTrxCode,
    description,
    redirectUrl,
    careGiverMokaId,
    dealerCommissionRate
) => {
    return new Promise(
        async (
            resolve,
            reject
        ) => {
            const mokaCredentials = mokaCredentialsHelper();

            const name = [
                firstName,
                middleName,
                lastName,
            ];
            
            const fullName = name.join(" ")
                                 .replaceAll("undefined", "")
                                 .replaceAll("  ", " ");

            if(
                !doesStringValueExistHelper( cardToken )
                && (
                   !doesStringValueExistHelper( fullName )
                   || !doesStringValueExistHelper( cardNumber )
                   || !doesStringValueExistHelper( cardExpMonth )
                   || !doesStringValueExistHelper( cardExpYear )
                   || !doesStringValueExistHelper( cardCvcNumber )
                )
            ){
                reject(
                    {
                        error: true,
                        serverStatus: -1,
                        message: "Card Data Required",
                    }
                );
            }

            let paymentDealerRequest = {
                "Amount": parseFloat( amount ),
                "ClientIP": env.MOKA_CLIENT_IP_FOR_TEST,
                "OtherTrxCode": otherTrxCode,
                "IsPoolPayment": 1,
                "IsPreAuth": 0,
                "IsTokenized": env.APP_NAME,
                "Description": description,
                "ReturnHash": 1,
                "RedirectUrl": redirectUrl,
                "RedirectType": 0,
                "CommissionScenario": 2,
                "SubDealer": [
                    {
                        "DealerId": careGiverMokaId,
                        "Amount": `${ parseFloat( amount ) }`,
                        "DealerCommissionRate": `${ parseFloat( dealerCommissionRate ) }`,
                        "DealerCommissionFixedAmount": "0"
                    }
                ]
            };

            const isPaymentGonnaBeWithRegisteredCard = cardToken;

            if( isPaymentGonnaBeWithRegisteredCard ){
                paymentDealerRequest.CardToken = cardToken;
            }else{
                paymentDealerRequest.CardHolderFullName = fullName;
                paymentDealerRequest.CardNumber = cardNumber;
                paymentDealerRequest.ExpMonth = cardExpMonth;
                paymentDealerRequest.ExpYear = cardExpYear;
                paymentDealerRequest.CvcNumber = cardCvcNumber;
            }

            
            const data = {
                "PaymentDealerAuthentication": mokaCredentials,
                "PaymentDealerRequest": dealerCustomerRequest

            }

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${ env.MOKA_TEST_URL_BASE }/PaymentDealer/DoDirectPaymentThreeDMarketPlace`,
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
                console.log( "ERROR: mokaCreate3dPaymentRequest - ", err );
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

export default mokaCreate3dPaymentRequest;