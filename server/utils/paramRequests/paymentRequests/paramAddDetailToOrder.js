import addDetailToOrderXmlModel from "../xml_data_models/payment_requests_xml_models/add_detail_to_order_xml_model.js";

import * as https from "https";
import axios from "axios";
import xml2js from "xml2js";
import dotenv from "dotenv";

dotenv.config();

const paramAddDetailToOrder = async (
    price,
    commission,
    orderId,
    subSellerGuid
) => {
    return new Promise(
        async (
            resolve,
            reject
        ) => {
            const commissionCount = ( price * commission ) / 100;
            const subsellersShare = price - commissionCount;

            const formatedPrice = price.toLocaleString(
                                        'tr-TR', 
                                        {
                                            minimumFractionDigits: 2
                                        }
                                    );

            const formatedSubsellersShare = subsellersShare.toLocaleString(
                                                                'tr-TR',
                                                                {
                                                                    minimumFractionDigits: 2
                                                                }
                                                            );

            let data = addDetailToOrderXmlModel(
                formatedPrice,
                formatedSubsellersShare,
                orderId,
                subSellerGuid
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
                    )
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
                                                [ "Pazaryeri_TP_Siparis_Detay_EkleResponse" ]
                                                [ 0 ]
                                                [ "Pazaryeri_TP_Siparis_Detay_EkleResult" ]
                                                [ 0 ];


                        const sonuc = routePath[ "Sonuc" ]
                                               [ 0 ]
                                               [ "_" ];

                        const sonucStr = routePath[ "Sonuc_Str" ]
                                                  [ 0 ]
                                                  [ "_" ];

                        const GUID_AltUyeIsyeri = routePath[ "GUID_AltUyeIsyeri" ]
                                                    ? routePath[ "GUID_AltUyeIsyeri" ]
                                                               [ 0 ]
                                                               [ "_" ]
                                                    : null;

                        const Tutar_Urun = routePath[ "Tutar_Urun" ]
                                             ? routePath[ "Tutar_Urun" ]
                                                        [ 0 ]
                                                        [ "_" ]
                                             : null;

                        const Tutar_Odenecek = routePath[ "Tutar_Odenecek" ]
                                                 ? routePath[ "Tutar_Odenecek" ]
                                                            [ 0 ]
                                                            [ "_" ]
                                                 : null;

                        const PYSiparis_GUID = routePath[ "PYSiparis_GUID" ]
                                                 ? routePath[ "PYSiparis_GUID" ]
                                                            [ 0 ]
                                                            [ "_" ]
                                                 : null;

                        const SanalPOS_Islem_ID = routePath[ "SanalPOS_Islem_ID" ]
                                                    ? routePath[ "SanalPOS_Islem_ID" ]
                                                               [ 0 ]
                                                               [ "_" ]
                                                    : null;

                        const Toplam_Tahsilat_Tutari = routePath[ "Toplam_Tahsilat_Tutari" ]
                                                         ? routePath[ "Toplam_Tahsilat_Tutari" ]
                                                                    [ 0 ]
                                                                    [ "_" ]
                                                         : null;

                        const Pazaryeri_Limit = routePath[ "Pazaryeri_Limit" ]
                                                  ? routePath[ "Pazaryeri_Limit" ]
                                                             [ 0 ]
                                                             [ "_" ]
                                                  : null;

                        const Yeni_Odenecek_Tutar = routePath[ "Yeni_Odenecek_Tutar" ]
                                                      ? routePath[ "Yeni_Odenecek_Tutar" ]
                                                                 [ 0 ]
                                                                 [ "_" ]
                                                      : null;
                        
                        response = {
                            error: false,
                            data: {
                                sonuc: sonuc,
                                sonucStr: sonucStr,
                                GUID_AltUyeIsyeri: GUID_AltUyeIsyeri,
                                Tutar_Urun: Tutar_Urun,
                                Tutar_Odenecek: Tutar_Odenecek,
                                PYSiparis_GUID: PYSiparis_GUID,
                                SanalPOS_Islem_ID: SanalPOS_Islem_ID,
                                Toplam_Tahsilat_Tutari: Toplam_Tahsilat_Tutari,
                                Pazaryeri_Limit: Pazaryeri_Limit,
                                Yeni_Odenecek_Tutar: Yeni_Odenecek_Tutar
                            }
                        }
    
                        if( sonuc !== "1" ){
                            response.error = true;
                        }
                            
                        resolve( response );
                    }
                );

            }catch( err ){
                console.log( "ERROR: paramAddDetailToOrder - ", err );
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

export default paramAddDetailToOrder;