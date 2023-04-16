import axios from "axios";
import { json } from "body-parser";
import xml2js from "xml2js";
import dotenv from "dotenv";

dotenv.config();

const paramCancelOrderRequest = async (
    orderGuid,
    situation,
    orderId,
    price
) => {

    if( situation !== 'IPTAL' && situation !== 'IADE' ){
        return json(
            {
                error: true,
                message: "wrong situation parameter"
            }
        );
    }

    let data = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n
            <soap:Body>\n
                <Pazaryeri_TP_Iptal_Iade xmlns="https://turkpos.com.tr/">\n
                    <G>\n
                        <CLIENT_CODE>${process.env.PARAM_CLIENT_CODE}</CLIENT_CODE>\n
                        <CLIENT_USERNAME>${process.env.PARAM_CLIENT_USERNAME}</CLIENT_USERNAME>\n
                        <CLIENT_PASSWORD>${process.env.PARAM_CLIENT_PASSWORD}</CLIENT_PASSWORD>\n
                    </G>\n
                    <PYSiparis_GUID>${orderGuid}</PYSiparis_GUID>\n
                    <GUID>${process.env.PARAM_GUID}</GUID>\n
                    <Durum>${situation}</Durum>\n
                    <Siparis_ID>${orderId}</Siparis_ID>\n
                    <Tutar>${price}</Tutar>\n
                <Pazaryeri_TP_Iptal_Iade>\n
            </soap:Body>\n
        </soap:Envelope>`;

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: process.env.PARAM_TEST_URL,
        headers: { 
            'Content-Type': 'text/xml;charset=UTF-8'
        },
        data : data
    };

    axios.request( config )
         .then(
            ( serverResponse ) => {
                let response;
    
                xml2js.parseString(
                    serverResponse.data,
                    (err, result) => {
    
                        if(err){
                            console.log(err);
                            response = {
                                error: true,
                            };
    
                            return response;
                        } else {
                            const sonuc = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_Iptal_IadeResponse"][0]["Pazaryeri_TP_Iptal_IadeResult"][0]["Sonuc"][0];
                            const sonucStr = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_Iptal_IadeResponse"][0]["Pazaryeri_TP_Iptal_IadeResult"][0]["Sonuc_Str"][0];
                            const Durum = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_Iptal_IadeResponse"][0]["Pazaryeri_TP_Iptal_IadeResult"][0]["Durum"][0];
                            const Durum_Str = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_Iptal_IadeResponse"][0]["Pazaryeri_TP_Iptal_IadeResult"][0]["Durum_Str"][0];
                            

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
                            
                            return response;
                        }
                    }
                );
            }
        ).catch(
            ( error ) => {
                console.log(error);
            }
        );
}

export default paramCancelOrderRequest;