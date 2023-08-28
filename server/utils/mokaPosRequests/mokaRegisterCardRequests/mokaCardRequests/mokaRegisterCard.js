import mokaCredentialsHelper from "../mokaHelpers/mokaCredentialsHelper.js";

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
    cardName,
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

            const dealerCustomerRequest = { 
                "CustomerCode": userId,
                "CardHolderFullName": fullName,
                "CardNumber": cardNo,
                "ExpMonth": cardExpiryMonth,
                "ExpYear": cardExpiryYear,
                "CardName": cardName
            };

            
            const data = {
                "DealerCustomerAuthentication": mokaCredentials,
                "DealerCustomerRequest": dealerCustomerRequest

            }

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${ env.MOKA_TEST_URL_BASE }/DealerCustomer/AddCard`,
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
                console.log( "ERROR: mokaRegisterCard - ", err );
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

export default mokaRegisterCard;