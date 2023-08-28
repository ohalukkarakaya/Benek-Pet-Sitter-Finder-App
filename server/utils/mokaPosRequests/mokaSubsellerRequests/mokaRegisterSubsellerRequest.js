import mokaCredentialsHelper from "../mokaHelpers/mokaCredentialsHelper.js";
import truncateAdressForMoka from "../mokaHelpers/truncateAdressForMoka.js";

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const env = process.env;

const mokaRegisterSubsellerRequest = async (
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
            const paddedNationalIdNo = nationalIdNo.padStart(
                                                        nationalIdNoLength, 
                                                        '0'
                                                    ).replace(
                                                        /[^\d]/g,
                                                        '0'
                                                    ).toUpperCase();

            const ibanFinal = iban.toUpperCase()
                                  .replaceAll( " ", "" )
                                  .replaceAll( "TR", "" );

            let openAdressMaxLength = 50;
            const openAdressFinal = truncateAdressForMoka( openAdress, openAdressMaxLength );

            const dealerRequest = {
                "DealerType": 1,
                "TRIdentityNumber": paddedNationalIdNo,
                "IndividualName": fullName,
                "Email": email,
                "PhoneNumber": phoneNumber.replaceAll( "+90", "" ),
                "MokaPosProposalTemplateLimitId": env.MOKA_POS_PROPOSAL_TEMPLATE_LIMIT_ID,
                "MokaPosProposalTemplateRateId": env.MOKA_POS_PROPOSAL_TEMPLATE_RATE_ID,
                "IBan": ibanFinal,
                "IBanFullName": fullName,
                "CityCode": env.CITY_CODE,
                "Address": openAdressFinal
            }

            
            const data = {
                "DealerAuthentication": mokaCredentials,
                "DealerRequest": dealerRequest

            }

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${ env.MOKA_TEST_URL_BASE }/Dealer/CreateDirectDealer`,
                headers: { 'Content-Type': 'application/json' },
                data: data
            };

            try{
                let response
                const responseData = await axios.request( config );

                const returnedResponse = responseData.data;
                if(
                    responseData.status !== 200
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

                let sonuc;
                if( 
                    returnedResponse.ResultCode === "Success"
                ){
                    sonuc = 1
                }else{
                    sonuc = -1
                }

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
                console.log( "ERROR: mokaRegisterSubsellerRequest - ", err );
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

export default mokaRegisterSubsellerRequest;