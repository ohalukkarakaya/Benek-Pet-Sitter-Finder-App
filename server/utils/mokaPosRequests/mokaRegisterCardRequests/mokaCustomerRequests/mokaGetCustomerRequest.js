import mokaCredentialsHelper from "../../mokaHelpers/mokaCredentialsHelper.js";

import https from "https";
import crypto from "node:crypto";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const env = process.env;

const mokaGetCustomerRequest = async ( userId ) => {
    try{
        const mokaCredentials = mokaCredentialsHelper();
        const dealerCustomerRequest = { "CustomerCode": userId };
        const data = {
            "DealerCustomerAuthentication": mokaCredentials,
            "DealerCustomerRequest": dealerCustomerRequest
        };
        
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${env.MOKA_TEST_URL_BASE}/DealerCustomer/GetCustomer`,
            headers: { 'Content-Type': 'application/json' },
            httpsAgent: new https.Agent( { secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT } ),
            data: data
        };

        const responseData = await axios.request(config);
        const returnedResponse = responseData.data;

        if(
            !responseData 
            || responseData.status !== 200 
            || returnedResponse.ResultCode !== "Success"
        ){
            if(
                responseData.status === 200 
                && returnedResponse.ResultCode === "DealerCustomer.GetCustomer.DealerCustomerNotFound"
            ){
                return {
                    error: false,
                    serverStatus: 0,
                    message: "Customer Not Registered"
                };
            }
            
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
    } catch( err ){
        console.log( "ERROR: mokaGetCustomerRequest - ", err );
        throw new Error( "Internal Server Error" );
    }
};

export default mokaGetCustomerRequest;