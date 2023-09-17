import mokaCredentialsHelper from "../../mokaHelpers/mokaCredentialsHelper.js";
import truncateAdressForMoka from "../../mokaHelpers/truncateAdressForMoka.js";

import https from "https";
import crypto from "node:crypto";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const env = process.env;

const mokaRegisterCustomerRequest = async (
    userId,
    firstName,
    lastName,
    phoneNumber,
    email,
    address
) => {
    try{
        const mokaCredentials = mokaCredentialsHelper();
        const openAdressMaxLength = 50;
        const openAdressFinal = truncateAdressForMoka( address, openAdressMaxLength );

        const dealerCustomerRequest = {
            "CustomerCode": userId,
            "Password": userId,
            "FirstName": firstName,
            "LastName": lastName,
            "GsmNumber": phoneNumber.replace("+90", ""),
            "Email": email,
            "Address": openAdressFinal
        };

        const data = {
            "DealerCustomerAuthentication": mokaCredentials,
            "DealerCustomerRequest": dealerCustomerRequest
        };

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${env.MOKA_TEST_URL_BASE}/DealerCustomer/AddCustomer`,
            headers: { 'Content-Type': 'application/json' },
            httpsAgent: new https.Agent( { secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT } ),
            data: data
        };

        const responseData = await axios.request( config );
        const returnedResponse = responseData.data;

        if(
            !responseData 
            || responseData.status !== 200 
            || returnedResponse.ResultCode !== "Success"
        ) {
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
                customerData: customerData
            }
        };
    }catch( err ){
        console.log( "ERROR: mokaRegisterCustomerRequest - ", err );
        throw new Error( "Internal Server Error" );
    }
};

export default mokaRegisterCustomerRequest;