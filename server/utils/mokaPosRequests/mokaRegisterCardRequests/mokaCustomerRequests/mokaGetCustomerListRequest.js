import mokaCredentialsHelper from "../mokaHelpers/mokaCredentialsHelper.js";

import https from "https";
import crypto from "node:crypto";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const env = process.env;

const mokaGetCustomerListRequest = async () => {
    return new Promise(
        async (
            resolve,
            reject
        ) => {
            const mokaCredentials = mokaCredentialsHelper();

            
            const data = {
                "DealerCustomerAuthentication": mokaCredentials
            }

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${ env.MOKA_TEST_URL_BASE }/DealerCustomer/GetCustomerList`,
                headers: { 'Content-Type': 'application/json' },
                httpsAgent: new https.Agent( { secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT } ),
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
                let customerData = returnedResponse.Data;

                response = {
                    error: false,
                    data: {
                        sonuc: sonuc,
                        sonucStr: sonucStr,
                        customerData: customerData
                    }
                }
                
                resolve( response );
            }catch( err ){
                console.log( "ERROR: mokaGetCustomerListRequest - ", err );
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

export default mokaGetCustomerListRequest;