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

            let data = `<?xml version="1.0" encoding="utf-8"?>
                        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                            <soap:Body>\n
                                <KS_Tahsilat xmlns="https://turkpara.com.tr/">\n
                                    <G>\n
                                        <CLIENT_CODE>${ process.env.PARAM_CLIENT_CODE }</CLIENT_CODE>\n
                                        <CLIENT_USERNAME>${ process.env.PARAM_CLIENT_USERNAME }</CLIENT_USERNAME>\n
                                        <CLIENT_PASSWORD>${ process.env.PARAM_CLIENT_PASSWORD }</CLIENT_PASSWORD>\n
                                    </G>\n
                                    <GUID>${ process.env.PARAM_GUID }</GUID>\n
                                    <KS_GUID>${ kkGuid }</KS_GUID>\n`
                                    + is3d ? `<CVV>${ cvv }</CVV>` : ""
                                    + `<KK_Sahibi_GSM>${ gsmNo }</KK_Sahibi_GSM>\n
                                    <Hata_URL>${ errorUrl }</Hata_URL>\n
                                    <Basarili_URL>${ successUrl }</Basarili_URL>\n
                                    <Siparis_ID>${ siparisId }</Siparis_ID>\n
                                    <Siparis_Aciklama>${ siparisAciklama }</Siparis_Aciklama>\n
                                    <Taksit>1</Taksit>\n
                                    <Islem_Tutar>${ formatedPrice }</Islem_Tutar>\n
                                    <Toplam_Tutar>${ formatedSubsellersShare }</Toplam_Tutar>\n
                                    <Islem_Guvenlik_Tip>${ paymentType }</Islem_Guvenlik_Tip>\n
                                    <IPAdr>127.0.0.1</IPAdr>\n
                                    <Ref_URL>${ refUrl }</Ref_URL>\n
                                    <KK_Islem_ID></KK_Islem_ID>\n
                                </KS_Tahsilat>\n
                            </soap:Body>\n
                        </soap:Envelope>`;

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