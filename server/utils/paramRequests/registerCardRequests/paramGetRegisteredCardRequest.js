import getRegisteredCardXmlModel from "../xml_data_models/register_card_requests_xml_models/get_registered_card_xml_model.js";

import * as https from "https";
import axios from "axios";
import xml2js from "xml2js";
import dotenv from "dotenv";

dotenv.config();

const env = process.env;

const paramGetRegisteredCreditCard = async ( kkGuid ) => {

    return new Promise(
        async (
            resolve,
            reject
        ) => {
            let data = getRegisteredCardXmlModel();

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
                    ( err, result ) => {

                        if( err ){
                            console.log(err);
                            response = {
                                error: true,
                            };

                            reject( response );
                        }
                        
                        const routePath = result[ "soap:Envelope" ]
                                                [ "soap:Body" ]
                                                [ 0 ]
                                                [ "KS_Kart_ListeResponse" ]
                                                [ 0 ]
                                                [ "KS_Kart_ListeResult" ]
                                                [ 0 ];

                        const sonuc = routePath[ "Sonuc" ]
                                               [ 0 ]
                                               [ "_" ];

                        const sonucStr = routePath[ "Sonuc_Str" ]
                                                  [ 0 ]
                                                  [ "_" ];

                        const DTBilgi = JSON.stringify( result.NewDataSet );

                        response = {
                            error: false,
                            data: {
                                sonuc: sonuc,
                                sonucStr: sonucStr,
                                DTBilgi: DTBilgi
                            }
                        }

                        if( sonuc !== "1" ){
                            response.error = true;
                        }
                            
                        resolve( response );
                    }
                );
            }catch( err ){
                console.log( "ERROR: paramGetRegisteredCreditCard - ", err );
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

export default paramGetRegisteredCreditCard;



