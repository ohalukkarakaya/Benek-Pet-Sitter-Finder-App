import cancelOrderXmlModel from "../xml_data_models/payment_requests_xml_models/cacel_order_xml_model.js";

import * as https from "https";
import axios from "axios";
import xml2js from "xml2js";
import dotenv from "dotenv";

dotenv.config();

const paramCancelOrderRequest = async (
    orderGuid,
    situation,
    orderId,
    price
) => {
    return new Promise(
        async (
            resolve,
            reject
        ) => {
            if( 
                situation !== 'IPTAL' 
                && situation !== 'IADE' 
            ){
                reject( 
                    {
                        error: true,
                        message: "wrong situation parameter"
                    }
                );
            }

            const formatedPrice = price.toLocaleString(
                'tr-TR', 
                {
                    minimumFractionDigits: 2
                }
            );

            let data = cancelOrderXmlModel(
                formatedPrice,
                orderGuid,
                orderId,
                situation
            );

            if(
                process.env
                       .ENVIROMENT === 'TEST'
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

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: process.env
                            .PARAM_TEST_URL,
                headers: { 
                    'Content-Type': 'text/xml;charset=UTF-8'
                },
                data : data
            };

            try{
                let response;
                const serverResponse = await axios.request( config );

                if( 
                    !serverResponse
                    || serverResponse.status !== 200
                ){
                    reject(
                        {
                            error: true,
                            serverStatus: -1,
                            message: "Internal Server Error",
                        }
                    );
                }

                xml2js.parseString(
                    serverResponse.data,
                    ( err, result ) => {
                        if( err ){
                            console.log( err );
                            response = {
                                error: true,
                            };
    
                            reject( response );
                        }
                        const routePath = result[ "soap:Envelope" ]
                                                [ "soap:Body" ]
                                                [ 0 ]
                                                [ "Pazaryeri_TP_Iptal_IadeResponse" ]
                                                [ 0 ]
                                                [ "Pazaryeri_TP_Iptal_IadeResult" ]
                                                [ 0 ];


                        const sonuc = routePath[ "Sonuc" ]
                                               [ 0 ]
                                               [ "_" ];

                        const sonucStr = routePath[ "Sonuc_Str" ]
                                                  [ 0 ]
                                                  [ "_" ];

                        const Durum = routePath[ "Durum" ]
                                               [ 0 ]
                                               [ "_" ];

                        const Durum_Str = routePath[ "Durum_Str" ]
                                                   [ 0 ]
                                                   [ "_" ];
                            

                        response = {
                            error: false,
                            data: {
                                sonuc: sonuc,
                                sonucStr: sonucStr,
                                Durum: Durum,
                                Durum_Str: Durum_Str
                            }
                        }
    
                        if( sonuc !== "1" ){
                            response.error = true;
                        }
                            
                        resolve( response );
                    }
                );
            }catch( err ){
                console.log( "ERROR: paramCancelOrderRequest - ", err );
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

export default paramCancelOrderRequest;