import updateSubsellerXmlModel from "../xml_data_models/subseller_requests_xml_models/update_subseller_xml_model.js";

import * as https from "https";
import axios from "axios";
import xml2js from "xml2js";
import dotenv from "dotenv";

dotenv.config();
const env = process.env;

const paramUpdateSubSellerRequest = async (
    guid,
    firstName,
    middleName,
    lastName,
    email,
    phoneNumber,
    openAdress,
    iban
) => {

    return new Promise(
        async(
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

            //send xml soap request to param
            const data = updateSubsellerXmlModel(
                guid,
                fullName,
                phoneNumber,
                iban,
                openAdress,
                email
            );

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: env.PARAM_TEST_URL,
                headers: {
                  'Content-Type': 'text/xml;charset=UTF-8',
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
                const serverResponse = axios.request( config );

                xml2js.parseString(
                    serverResponse.data,
                    ( err, result ) => {
    
                        if(err){
                            console.log(err);
                            let response = {
                                error: true,
                            };
    
                            resolve( response );
                        } else {
                            const routePath = result[ "soap:Envelope" ]
                                                    [ "soap:Body" ]
                                                    [ 0 ]
                                                    [ "Pazaryeri_TP_AltUyeIsyeri_GuncellemeResponse" ]
                                                    [ 0 ]
                                                    [ "Pazaryeri_TP_AltUyeIsyeri_GuncellemeResult" ]
                                                    [ 0 ];

                            const sonuc = routePath[ "Sonuc" ]
                                                   [ 0 ]
                                                   [ "_" ];

                            const sonucStr = routePath[ "Sonuc_Str" ]
                                                      [ 0 ]
                                                      [ "_" ];
    
                            let response = {
                                error: false,
                                data: {
                                    sonuc: sonuc,
                                    sonucStr: sonucStr
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
                console.log( "ERROR: paramUpdateSubSellerRequest - ", err );
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

export default paramUpdateSubSellerRequest;