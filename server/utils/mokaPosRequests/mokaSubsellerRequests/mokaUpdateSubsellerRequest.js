import mokaCredentialsHelper from "../mokaHelpers/mokaCredentialsHelper.js";

import https from "https";
import crypto from "node:crypto";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const env = process.env;

function truncateString(str, maxLength) {
    if (str && str.length <= maxLength) {
        return str;
    }
    return str ? str.substring(0, (maxLength - 3)) + "..." : null;
}

const mokaUpdateSubsellerRequest = async (
    mokaSubSellerCode,
    firstName,
    middleName,
    lastName,
    email,
    nationalIdNo,
    phoneNumber,
    openAdress,
    iban
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

            const nationalIdNoLength = 10;
            const paddedNationalIdNo = nationalIdNo ? nationalIdNo.padStart( nationalIdNoLength, '0' ).replace( /[^\d]/g,  '0' ).toUpperCase() : null;

            const ibanFinal = (typeof iban === 'string') ? iban.toUpperCase().replaceAll(" ", "").replaceAll("TR", "") : null;

            let openAdressMaxLength = 50;
            const openAdressFinal = truncateString( openAdress, openAdressMaxLength );

            const phoneNumberFinal = phoneNumber ? phoneNumber.replaceAll( "+90", "" ) : null;

            let updateDealerRequest = {};

            updateDealerRequest.SubDealerCode = mokaSubSellerCode;

            if(
                paddedNationalIdNo !== null
                && paddedNationalIdNo !== undefined
                && paddedNationalIdNo !== ""
                && paddedNationalIdNo !== " "
            ){
                updateDealerRequest.TRIdentityNumber = paddedNationalIdNo;
            }
            
            if(
                fullName !== null
                && fullName !== undefined
                && fullName !== ""
                && fullName !== " "
            ){
                updateDealerRequest.IndividualName = fullName;
                updateDealerRequest.IBanFullName = fullName;
            }

            if(
                email !== null
                && email !== undefined
                && email !== ""
                && email !== " "
            ){
                updateDealerRequest.Email = email;
            }

            if(
                phoneNumberFinal !== null
                && phoneNumberFinal !== undefined
                && phoneNumberFinal !== ""
                && phoneNumberFinal !== " "
            ){   
                updateDealerRequest.PhoneNumber = phoneNumberFinal;
            }

            if(
                ibanFinal !== null
                && ibanFinal !== undefined
                && ibanFinal !== ""
                && ibanFinal !== " "
            ){   
                updateDealerRequest.IBan = ibanFinal;
            }

            if(
                openAdressFinal !== null
                && openAdressFinal !== undefined
                && openAdressFinal !== ""
                && openAdressFinal !== " "
            ){   
                updateDealerRequest.Address = openAdressFinal;
            }
            
            const data = {
                "DealerAuthentication": mokaCredentials,
                "UpdateDealerRequest": updateDealerRequest

            }

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${ env.MOKA_TEST_URL_BASE }/Dealer/UpdateDealer`,
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
                let altUyeIsyeriData = returnedResponse.Data;

                response = {
                    error: false,
                    data: {
                        sonuc: sonuc,
                        sonucStr: sonucStr,
                        altUyeIsyeriData: altUyeIsyeriData
                    }
                }
                
                resolve( response );
            }catch( err ){
                console.log( "ERROR: mokaUpdateSubsellerRequest - ", err );
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

export default mokaUpdateSubsellerRequest;