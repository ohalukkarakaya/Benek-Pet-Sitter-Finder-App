import mokaCredentialsHelper from "../mokaHelpers/mokaCredentialsHelper.js";
import truncateAdressForMoka from "../../mokaHelpers/truncateAdressForMoka.js";

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const env = process.env;

const mokaUpdateCustomerRequest = async (
    userId,
    firstName,
    lastName,
    phoneNumber,
    email,
    address
) => {
    return new Promise(
        async (
            resolve,
            reject
        ) => {
            const mokaCredentials = mokaCredentialsHelper();

            let openAdressMaxLength = 50;
            const openAdressFinal = truncateAdressForMoka( address, openAdressMaxLength );

            const finalPhoneNumber = phoneNumber.replaceAll( "+90", "" );

            const dealerCustomerRequest = {
                "CustomerCode": userId,
                "Password": userId
            }

            if(
                firstName
                && firstName !== null
                && firstName !== undefined
                && firstName !== ""
                && firstName !== " "
            ){
                dealerCustomerRequest.FirstName = firstName;
            }

            if(
                lastName
                && lastName !== null
                && lastName !== undefined
                && lastName !== ""
                && lastName !== " "
            ){
                dealerCustomerRequest.LastName = lastName;
            }

            if(
                finalPhoneNumber
                && finalPhoneNumber !== null
                && finalPhoneNumber !== undefined
                && finalPhoneNumber !== ""
                && finalPhoneNumber !== " "
            ){
                dealerCustomerRequest.GsmNumber = finalPhoneNumber;
            }

            if(
                email
                && email !== null
                && email !== undefined
                && email !== ""
                && email !== " "
            ){
                dealerCustomerRequest.Email = email;
            }

            if(
                openAdressFinal
                && openAdressFinal !== null
                && openAdressFinal !== undefined
                && openAdressFinal !== ""
                && openAdressFinal !== " "
            ){
                dealerCustomerRequest.Address = openAdressFinal;
            }

            
            const data = {
                "DealerCustomerAuthentication": mokaCredentials,
                "DealerCustomerRequest": dealerCustomerRequest

            }

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${ env.MOKA_TEST_URL_BASE }/DealerCustomer/UpdateCustomer`,
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
                console.log( "ERROR: mokaUpdateCustomerRequest - ", err );
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

export default mokaUpdateCustomerRequest;