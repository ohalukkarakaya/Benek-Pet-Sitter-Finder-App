import axios from "axios";
import xml2js from "xml2js";
import * as https from "https";
import dotenv from "dotenv";

dotenv.config();

const paramDeleteSubSellerRequest = async (
    careGiverGUID
) => {
    return new Promise(
        async(
            resolve,
            reject
        ) => {
            //send xml soap request to param
            const soapRequest = `<?xml version="1.0" encoding="utf-8"?> <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                <Pazaryeri_TP_AltUyeIsyeri_Silme xmlns="https://turkpos.com.tr/">
                    <G>
                        <CLIENT_CODE>${process.env.PARAM_CLIENT_CODE}</CLIENT_CODE>
                        <CLIENT_USERNAME>${process.env.PARAM_CLIENT_USERNAME}</CLIENT_USERNAME>
                        <CLIENT_PASSWORD>${process.env.PARAM_CLIENT_PASSWORD}</CLIENT_PASSWORD>
                    </G> 
                    <GUID_AltUyeIsyeri>${careGiverGUID}</GUID_AltUyeIsyeri>
                </Pazaryeri_TP_AltUyeIsyeri_Silme>
                </soap:Body>
            </soap:Envelope>`;

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: process.env.PARAM_TEST_URL,
                headers: {
                  'Content-Type': 'text/xml;charset=UTF-8',
                },
                data: soapRequest
            };

            if(
                process.env.ENVIROMENT === 'TEST'
            ){
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
                    (err, result) => {
    
                        if( err ){
                            console.log( err );
                            let response = {
                                error: true,
                            };
    
                            reject( response );
                        } else {
                            const routePath = result[ "soap:Envelope" ][ "soap:Body" ]
                                                                         [ 0 ]
                                                                         [ "Pazaryeri_TP_AltUyeIsyeri_SilmeResponse" ]
                                                                         [ 0 ]
                                                                         [ "Pazaryeri_TP_AltUyeIsyeri_SilmeResult" ]
                                                                         [ 0 ]
                            let sonuc = routePath[ "Sonuc" ]
                                                 [ 0 ]
                                                 [ "_" ];

                            let sonucStr = routePath[ "Sonuc_Str" ]
                                                    [ 0 ]
                                                    [ "_" ];

                            let response = {
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