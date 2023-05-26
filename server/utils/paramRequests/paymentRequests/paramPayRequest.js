import payXmlModel from "../xml_data_models/payment_requests_xml_models/pay_xml_model.js";

import * as https from "https";
import axios from "axios";
import xml2js from "xml2js";
import dotenv from "dotenv";

dotenv.config();

const paramPayRequest = async (
    firstName,
    middleName,
    lastName,
    price,
    commission,
    cardNo,
    cardExpiryMonth,
    cardExpiryYear,
    cvv,
    gsmNo,
    successUrl,
    errorUrl,
    siparisId,
    siparisAciklama,
    hashValue,
    paymentType,
    refUrl
) => {
    return new Promise(
        async (
            resolve,
            reject
        ) => {
            let is3d = false;
            if( 
                paymentType !== 'NS' 
                && paymentType === '3d' 
            ){
                reject(
                    {
                        error: true,
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

            const name = [
                firstName,
                middleName,
                lastName,
            ];

            const fullName = name.join(" ")
                                 .replaceAll("undefined", "")
                                 .replaceAll("  ", " ");

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

            let data = payXmlModel(
                fullName,
                cardNo,
                cardExpiryMonth,
                cardExpiryYear,
                cvv,
                gsmNo,
                errorUrl,
                successUrl,
                siparisId,
                siparisAciklama,
                paymentType,
                refUrl,
                formatedPrice,
                formatedSubsellersShare,
                hashValue
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
                url: process.env.PARAM_TEST_URL,
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
                    (err, result) => {
    
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
                                                [ "TP_WMD_UCDResponse" ]
                                                [ 0 ]
                                                [ "TP_WMD_UCDResult" ]
                                                [ 0 ];


                        const sonuc = routePath[ "Sonuc" ]
                                               [ 0 ]
                                               [ "_" ];

                        const sonucStr = routePath[ "Sonuc_Str" ]
                                                  [ 0 ]
                                                  [ "_" ];

                        const islemId = routePath[ "Islem_ID" ]
                                          ? routePath[ "Islem_ID" ]
                                                     [ 0 ]
                                                     [ "_" ]
                                          : null;

                        const UCD_HTML = routePath[ "UCD_HTML" ]
                                           ? routePath[ "UCD_HTML" ]
                                                      [ 0 ]
                                                      [ "_" ]
                                           : null;

                        const Bank_Trans_ID = routePath[ "Bank_Trans_ID" ]
                                                ? routePath[ "Bank_Trans_ID" ]
                                                           [ 0 ]
                                                           [ "_" ]
                                                : null;

                        const Bank_AuthCode = routePath[ "Bank_AuthCode" ]
                                                ? routePath[ "Bank_AuthCode" ]
                                                           [ 0 ]
                                                           [ "_" ]
                                                : null;

                        const Banka_Sonuc_Kod = routePath[ "Banka_Sonuc_Kod" ]
                                                  ? routePath[ "Banka_Sonuc_Kod" ]
                                                             [ 0 ]
                                                             [ "_" ]
                                                  : null;
                            

                        response = {
                            error: false,
                            data: {
                                sonuc: sonuc,
                                sonucStr: sonucStr,
                                islemId: islemId,
                                UCD_HTML: UCD_HTML,
                                Bank_Trans_ID: Bank_Trans_ID,
                                Bank_AuthCode: Bank_AuthCode,
                                Banka_Sonuc_Kod: Banka_Sonuc_Kod
                            }
                        }
    
                        if( sonuc !== "1" ){
                            response.error = true;
                        }
                            
                        resolve( response );        
                    }
                );
            }catch( err ){
                console.log( "ERROR: paramPayRequest - ", err );
                reject(
                    {
                        error: true,
                        serverStatus: -1,
                        message: 'cvv is required for 3d payment'
                    }
                );
            }
            


        }
    );
}

export default paramPayRequest;