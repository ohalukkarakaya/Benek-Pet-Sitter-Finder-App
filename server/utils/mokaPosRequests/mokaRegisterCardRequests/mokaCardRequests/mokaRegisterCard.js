import mokaCredentialsHelper from "../../mokaHelpers/mokaCredentialsHelper.js";
import mokaCheckifCardAlreadyRegisteredHelper from "../../mokaHelpers/mokaCheckifCardAlreadyRegisteredHelper.js";

import https from "https";
import crypto from "node:crypto";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const env = process.env;

const mokaRegisterCard = async (
    userId,
    firstName,
    middleName,
    lastName,
    cardNo,
    cardExpiryMonth,
    cardExpiryYear,
    cardName
) => {
    try {
        const isCardAlreadyRegistered = await mokaCheckifCardAlreadyRegisteredHelper( userId, cardNo );

        if( isCardAlreadyRegistered.isCardAlreadyRegistered ){
            throw new Error( "Card Already Registered" );
        }

        const mokaCredentials = mokaCredentialsHelper();

        const fullName = [ firstName, middleName, lastName ].filter(
                                                                name => 
                                                                    name !== undefined 
                                                                    && name !== null 
                                                                    && name.trim() !== ""
                                                            ).join(" ");

        const dealerCustomerRequest = {
            "CustomerCode": userId,
            "CardHolderFullName": fullName,
            "CardNumber": cardNo,
            "ExpMonth": cardExpiryMonth,
            "ExpYear": cardExpiryYear,
            "CardName": cardName,
        };

        const data = {
            "DealerCustomerAuthentication": mokaCredentials,
            "DealerCustomerRequest": dealerCustomerRequest,
        };

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${env.MOKA_TEST_URL_BASE}/DealerCustomer/AddCard`,
            headers: { 'Content-Type': 'application/json' },
            httpsAgent: new https.Agent( { secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT } ),
            data: data,
        };

        const responseData = await axios.request( config );
        const returnedResponse = responseData.data;

        if(
            !responseData 
            || responseData.status !== 200 
            || returnedResponse.ResultCode !== "Success"
        ){
            throw new Error( `Api error: ${responseData.status}, Server Message: ${returnedResponse.ResultCode}` );
        }

        const sonuc = returnedResponse.ResultCode === "Success" ? 1 : -1;
        const sonucStr = returnedResponse.ResultCode;
        const customerData = returnedResponse.Data;

        return {
            error: false,
            data: {
                sonuc: sonuc,
                sonucStr: sonucStr,
                customerData: customerData,
            },
        };
    }catch( err ){
        console.log( "ERROR: mokaRegisterCard - ", err );
        throw new Error( "Internal Server Error" );
    }
};

export default mokaRegisterCard;
