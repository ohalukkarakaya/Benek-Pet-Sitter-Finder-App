import aproveOrderXmlModel from "../xml_data_models/payment_requests_xml_models/aprove_order_xml_model.js";

import * as https from "https";
import axios from "axios";
import xml2js from "xml2js";
import dotenv from "dotenv";

dotenv.config();

const paramAproveOrderRequest = async (
    orderGuid
) => {

    return new Promise(
        async (
            resolve,
            reject
        ) => {
            let data = aproveOrderXmlModel( orderGuid );

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
                url: process.env.PARAM_TEST_URL,
                headers: { 
                    'Content-Type': 'text/xml;charset=UTF-8'
                },
                data : data
            };

            try{
                let response
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
                            console.log(err);
                            response = {
                                error: true,
                            };
    
                            reject( response );
                        }

                        const routePath = result[ "soap:Envelope" ]
                                                [ "soap:Body" ]
                                                [ 0 ]
                                                [ "Pazaryeri_TP_Siparis_OnayResponse" ]
                                                [ 0 ]
                                                [ "Pazaryeri_TP_Siparis_OnayResult" ]
                                                [ 0 ];
                                                

                        const sonuc = routePath[ "Sonuc" ]
                                               [ 0 ]
                                               [ "_" ];

                        const sonucStr = routePath[ "Sonuc_Str" ]
                                                  [ 0 ]
                                                  [ "_" ];

                        const POS_Islem_Id = routePath[ "POS_Islem_Id" ]
                                                      [ 0 ]
                                                      [ "_" ];

                        const GUID_AltUyeIsyeri = routePath[ "GUID_AltUyeIsyeri" ]
                                                           [ 0 ]
                                                           [ "_" ];

                        const Tutar_Urun = routePath[ "Tutar_Urun" ]
                                                    [ 0 ]
                                                    [ "_" ];

                        const Tutar_Odenecek = routePath[ "Tutar_Odenecek" ]
                                                        [ 0 ]
                                                        [ "_" ];

                        const Durum = routePath[ "SanalPOS_Islem_ID" ]
                                               [ 0 ]
                                               [ "_" ];

                        const Toplam_Tahsilat_Tutari = routePath[ "Durum" ]
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
                                POS_Islem_Id: POS_Islem_Id,
                                GUID_AltUyeIsyeri: GUID_AltUyeIsyeri,
                                Tutar_Urun: Tutar_Urun,
                                Tutar_Odenecek: Tutar_Odenecek,
                                Durum: Durum,
                                Toplam_Tahsilat_Tutari: Toplam_Tahsilat_Tutari,
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
                console.log( "ERROR: paramAproveOrderRequest - ", err );
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

export default paramAproveOrderRequest;