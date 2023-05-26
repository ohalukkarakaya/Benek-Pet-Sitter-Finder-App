import payWithRegisteredCardXmlModel from "../xml_data_models/payment_requests_xml_models/pay_with_registered_card_xml_model.js";

import * as https from "https";
import axios from "axios";
import xml2js from "xml2js";
import dotenv from "dotenv";

dotenv.config();

const paramPayWithRegisteredCard = async (
    kkGuid,
    cvv,
    gsmNo,
    successUrl,
    errorUrl,
    siparisId,
    siparisAciklama,
    price,
    commission,
    paymentType,
    refUrl
) => {
    
    return new Promise(
        async (
            resolve,
            reject
        ) => {
            var is3d = false
            if( 
                paymentType !== 'NS' 
                && paymentType === '3d' 
            ){
                reject(
                    {
                        error: true,
                        serverStatus: -1,
                        message: 'Payment type must be NS or 3D'
                    }
                );
            }

            if( 
                paymentType === '3D' 
                && !cvv 
            ){
                reject(
                    {
                        error: true,
                        serverStatus: -1,
                        message: 'cvv is required for 3d payment'
                    }
                );
            }else if( 
                paymentType === '3D' 
                && cvv  
            ){
                is3d = true;
            }

            if( 
                !price 
                || !commission 
            ){
                reject(
                    {
                        error: true,
                        serverStatus: -1,
                        message: 'price is required for payment'
                    }
                );
            }

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

            let data = payWithRegisteredCardXmlModel(
                kkGuid,
                is3d,
                cvv,
                gsmNo,
                errorUrl,
                successUrl,
                siparisId,
                siparisAciklama,
                formatedPrice,
                formatedSubsellersShare,
                paymentType,
                refUrl
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
                            .PARAM_CARD_REGISTER_TEST_URL,
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
                            serverStatus: serverResponse.status,
                            message: 'Internal Server Error'
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
    
                            resolve( response );
                        }

                        const routePath = result[ "soap:Envelope" ]
                                                [ "soap:Body" ]
                                                [ 0 ]
                                                [ "KS_TahsilatResponse" ]
                                                [ 0 ]
                                                [ "KS_TahsilatResult" ]
                                                [ 0 ];

                        const sonuc = routePath[ "Sonuc" ]
                                               [ 0 ]
                                               [ "_" ];

                        const sonucStr = routePath[ "Sonuc_Str" ]
                                                  [ 0 ]
                                                  [ "_" ];

                        const islemID = routePath[ "Islem_ID" ]
                                         ? routePath[ "Islem_ID" ]
                                                    [ 0 ]
                                                    [ "_" ]
                                         : null;

                        const UCDURL = routePath[ "UCD_URL" ]
                                         ? routePath[ "UCD_URL" ]
                                                    [ 0 ]
                                                    [ "_" ]
                                         : null;
    
                        response = {
                            error: false,
                            data: {
                                sonuc: sonuc,
                                sonucStr: sonucStr,
                                islemID: islemID,
                                UCDURL: UCDURL
                            }
                        }
    
                        if( sonuc !== "1" ){
                            response.error = true;
                        }
                            
                        reject( response );
                    }
                );
            }catch( err ){
                console.log( "ERROR: paramPayWithRegisteredCard - ", err );
                reject(
                    {
                        error: true,
                        serverStatus: -1,
                        message: 'Internal Server Error'
                    }
                );
            }
        }
    );
}

export default paramPayWithRegisteredCard;