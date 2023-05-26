import registerSubsellerXmlModel from "../xml_data_models/subseller_requests_xml_models/register_subseller_xml_model.js";

import axios from "axios";
import xml2js from "xml2js";
import * as https from "https";
import dotenv from "dotenv";

dotenv.config();
const env = process.env;

const paramRegisterSubSellerRequest = async (
    firstName,
    middleName,
    lastName,
    birthday,
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
                                                      );

            //send xml soap request to param
            const data = registerSubsellerXmlModel(
                fullName,
                paddedNationalIdNo,
                birthday,
                phoneNumber,
                iban,
                openAdress
            );

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: env.PARAM_TEST_URL,
                headers: {
                  'Content-Type': 'text/xml;charset=UTF-8',
                  'SOAPAction': env.PARAM_ADD_SUBSELLER_SOAP_ACTION_URL,
                },
                data: data
            };

            if( env.ENVIROMENT === 'TEST' ){
                //To Do: remove this on prod env
                const httpsAgent = new https.Agent(
                    {
                        rejectUnauthorized: false,
                    }
                );

                axios.defaults
                     .httpsAgent = httpsAgent;
            }

            try{
                const responseData = await axios.request( config );
                xml2js.parseString(
                    responseData.data,
                    ( err, result ) => {
    
                        if( err ){
                            console.log( err );
                            let response = {
                                error: true,
                            };
    
                            reject( response );
                        } else {
                            const routePath = result[ "soap:Envelope" ]
                                                    [ "soap:Body" ]
                                                    [ 0 ]
                                                    [ "Pazaryeri_TP_AltUyeIsyeri_EklemeResponse" ]
                                                    [ 0 ]
                                                    [ "Pazaryeri_TP_AltUyeIsyeri_EklemeResult" ]
                                                    [ 0 ];

                            let sonuc = routePath[ "Sonuc" ]
                                                 [ 0 ]
                                                 [ "_" ];

                            let sonucStr = routePath[ "Sonuc_Str" ]
                                                    [ 0 ]
                                                    [ "_" ];

                            let guidAltUyeIsyeri = routePath[ "GUID_AltUyeIsyeri" ]

                                                    ? routePath[ "GUID_AltUyeIsyeri" ]
                                                               [ 0 ]
                                                               [ "_" ]
                                                    : null;
                            
                            let response = {
                                error: false,
                                data: {
                                    sonuc: sonuc,
                                    sonucStr: sonucStr,
                                    guidAltUyeIsyeri: guidAltUyeIsyeri
                                }
                            }
    
                            if( sonuc !== "1" ){
                                response.error = true;
                            }
                            
                            resolve( response );
                        }
                    }
                );
            }catch( err ){
                console.log( "ERROR: paramRegisterSubSellerRequest - ", err );
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

export default paramRegisterSubSellerRequest;