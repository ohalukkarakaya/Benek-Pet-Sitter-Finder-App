import deleteSubsellerXmlModel from "../xml_data_models/subseller_requests_xml_models/delete_subseller_xml_model.js";

import axios from "axios";
import xml2js from "xml2js";
import * as https from "https";
import dotenv from "dotenv";

dotenv.config();

const env = process.env;

const paramDeleteSubSellerRequest = async (
    careGiverGUID
) => {
    return new Promise(
        async(
            resolve,
            reject
        ) => {
            //send xml soap request to param
            const data = deleteSubsellerXmlModel( careGiverGUID );

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

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: env.PARAM_TEST_URL,
                headers: {
                  'Content-Type': 'text/xml;charset=UTF-8',
                },
                data: data
            };

            try{
                let response;
                const responseData = await axios.request( config );
                xml2js.parseString(
                    responseData.data,
                    ( err, result ) => {
    
                        if( err ){
                            console.log( err );
                            response = {
                                error: true,
                            };
    
                            reject( response );
                        } else {
                            const routePath = result[ "soap:Envelope" ]
                                                      [ "soap:Body" ]
                                                      [ 0 ]
                                                      [ "Pazaryeri_TP_AltUyeIsyeri_SilmeResponse" ]
                                                      [ 0 ]
                                                      [ "Pazaryeri_TP_AltUyeIsyeri_SilmeResult" ]
                                                      [ 0 ];
                                                      
                            let sonuc = routePath[ "Sonuc" ]
                                                   [ 0 ]
                                                   [ "_" ];

                            let sonucStr = routePath[ "Sonuc_Str" ]
                                                      [ 0 ]
                                                      [ "_" ];

                            response = {
                                error: false,
                                data: {
                                    sonuc: sonuc,
                                    sonucStr: sonucStr,
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
                console.log( "ERROR: paramDeleteSubSellerRequest - ", err );
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

export default paramDeleteSubSellerRequest;