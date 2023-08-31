import mokaCredentialsHelper from "../mokaHelpers/mokaCredentialsHelper.js";
import axios from "axios";
import dotenv from "dotenv";
import doesStringValueExistHelper from "../../doesStringValueExistHelper.js";

dotenv.config();
const env = process.env;

const validateCardData = (
    cardToken, 
    fullName, 
    cardNumber, 
    cardExpMonth, 
    cardExpYear, 
    cardCvcNumber
) => {
    if ( 
        !doesStringValueExistHelper( cardToken ) 
    ){
        if (
            !doesStringValueExistHelper( fullName ) 
            || !doesStringValueExistHelper( cardNumber ) 
            || !doesStringValueExistHelper( cardExpMonth ) 
            || !doesStringValueExistHelper( cardExpYear ) 
            || !doesStringValueExistHelper( cardCvcNumber )
        ) {
            throw new Error( "Card Data Required" );
        }
    }
};

const createPaymentDealerRequest = (
    careGiverMokaId,
    cardToken, 
    fullName, 
    cardNumber, 
    cardExpMonth, 
    cardExpYear, 
    cardCvcNumber,
    amount,
    otherTrxCode,
    description,
    redirectUrl,
    dealerCommissionRate
) => {
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

    if( cardToken ){
        paymentDealerRequest.CardToken = cardToken;
    }else{
        paymentDealerRequest.CardHolderFullName = fullName;
        paymentDealerRequest.CardNumber = cardNumber;
        paymentDealerRequest.ExpMonth = cardExpMonth;
        paymentDealerRequest.ExpYear = cardExpYear;
        paymentDealerRequest.CvcNumber = cardCvcNumber;
    }

    return paymentDealerRequest;
};

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
    try {
        const mokaCredentials = mokaCredentialsHelper();
        const fullName = [ firstName, middleName, lastName ].filter(
                                                                name => 
                                                                    name !== undefined 
                                                                    && name !== null 
                                                                    && name.trim() !== ""
                                                             ).join(" ");

        validateCardData(
            cardToken, 
            fullName, 
            cardNumber, 
            cardExpMonth, 
            cardExpYear, 
            cardCvcNumber
        );

        const paymentDealerRequest = createPaymentDealerRequest(
                                        careGiverMokaId,
                                        cardToken, 
                                        fullName, 
                                        cardNumber, 
                                        cardExpMonth, 
                                        cardExpYear, 
                                        cardCvcNumber,
                                        amount,
                                        otherTrxCode,
                                        description,
                                        redirectUrl,
                                        dealerCommissionRate
                                    );

        const data = {
            "PaymentDealerAuthentication": mokaCredentials,
            "PaymentDealerRequest": paymentDealerRequest,
        };

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${env.MOKA_TEST_URL_BASE}/PaymentDealer/DoDirectPaymentThreeDMarketPlace`,
            headers: { 'Content-Type': 'application/json' },
            data: data,
        };

        const responseData = await axios.request( config );
        const returnedResponse = responseData.data;

        if(
            !responseData 
            || responseData.status !== 200 
            || returnedResponse.ResultCode !== "Success"
        ){
            if(
                returnedResponse.ResultCode === "PaymentDealer.CheckDealerPaymentLimits.DailyDealerLimitExceeded"
            ){
                return {
                    error: false,
                    serverStatus: 0,
                    message: "Daily Limit Exceeded",
                };
            }
            throw new Error( `Api error: ${responseData.status}, Server Message: ${returnedResponse.ResultCode}` );
        }

        const sonuc = returnedResponse.ResultCode === "Success" ? 1 : -1;
        const sonucStr = returnedResponse.ResultCode;
        const threeDPayData = returnedResponse.Data;

        return {
            error: false,
            data: {
                sonuc: sonuc,
                sonucStr: sonucStr,
                threeDPayData: threeDPayData,
            },
        };
    }catch( err ){
        console.log( "ERROR: mokaCreate3dPaymentRequest - ", err );
        throw new Error( "Internal Server Error" );
    }
};

export default mokaCreate3dPaymentRequest;
