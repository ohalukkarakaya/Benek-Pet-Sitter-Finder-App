import registerCreditCardXmlModel from "../xml_data_models/register_card_requests_xml_models/register_credit_card_xml_model.js";

import * as https from "https";
import axios from "axios";
import xml2js from "xml2js";
import dotenv from "dotenv";

dotenv.config();
const env = process.env;

const paramRegisterCreditCardRequest = async (
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
            const name = [
                firstName,
                middleName,
                lastName,
            ];
            
            const fullName = name.join(" ")
                                 .replaceAll("undefined", "")
                                 .replaceAll("  ", " ");

            let data = registerCreditCardXmlModel(
                fullName,
                cardNo,
                cardExpiryMonth,
                cardExpiryYear,
                cardName
            );

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

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: env.PARAM_CARD_REGISTER_TEST_URL,
                headers: { 
                    'Content-Type': 'text/xml;charset=UTF-8'
                },
                data : data
            };

            try{
                const serverResponse = await axios.request( config );
                let response;

                xml2js.parseString(
                    serverResponse.data,
                    (err, result) => {
    
                        if(err){
                            console.log( err );
                            response = {
                                error: true,
                            };
    
                            reject( response );
                        }
                        const routePath = result[ "soap:Envelope" ]
                                                [ "soap:Body" ]
                                                [ 0 ]
                                                [ "KS_Kart_EkleResponse" ]
                                                [ 0 ]
                                                [ "KS_Kart_EkleResult" ]
                                                [ 0 ];

                        const sonuc = routePath[ "Sonuc" ]
                                               [ 0 ]
                                               [ "_" ];

                        const sonucStr = routePath[ "Sonuc_Str" ]
                                                  [ 0 ]
                                                  [ "_" ];

                        const ksGuid = routePath[ "KS_GUID" ]
                                                [ 0 ]
                                                [ "_" ];
    
                        response = {
                            error: false,
                            data: {
                                sonuc: sonuc,
                                sonucStr: sonucStr,
                                ksGuid: ksGuid
                            }
                        }
    
                        if( sonuc !== "1" ){
                            response.error = true;
                        }
                            
                        resolve( response );
                    }
                );
            }catch( err ){
                console.lof( "ERROR: paramRegisterCreditCardRequest - ", err );
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

export default paramRegisterCreditCardRequest;
