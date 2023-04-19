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
    CardExpiryMonth,
    CardExpiryYear,
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
    
    var is3d = false

    if( paymentType !== 'NS' && paymentType === '3d' ){
        return json(
            {
                error: true,
                message: 'Payment type must be NS or 3D'
            }
        );
    }
    if( paymentType === '3D' && !cvv ){
        return json(
            {
                error: true,
                message: 'cvv is required for 3d payment'
            }
        );
    }else if( paymentType === '3D' && cvv  ){
        is3d = true;
    }

    const name = [
        firstName,
        middleName,
        lastName,
    ];
    
    const fullName = name.join(" ");

    var subsellersShare = price - commission;

    let data = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>\n
                <TP_WMD_UCD xmlns="https://turkpos.com.tr/">\n
                    <G>\n
                        <CLIENT_CODE>${process.env.PARAM_CLIENT_CODE}</CLIENT_CODE>\n
                        <CLIENT_USERNAME>${process.env.PARAM_CLIENT_USERNAME}</CLIENT_USERNAME>\n
                        <CLIENT_PASSWORD>${process.env.PARAM_CLIENT_PASSWORD}</CLIENT_PASSWORD>\n
                    </G>\n
                    <GUID>${process.env.PARAM_GUID}</GUID>\n
                    <KK_Sahibi>${fullName}</KK_Sahibi>\n
                    <KK_No>${cardNo}</KK_No>\n
                    <KK_SK_Ay>${CardExpiryMonth}</KK_SK_Ay>\n
                    <KK_SK_Yil>${CardExpiryYear}</KK_SK_Yil>\n
                    <CVV>${cvv}</CVV>
                    <KK_Sahibi_GSM>${gsmNo}</KK_Sahibi_GSM>\n
                    <Hata_URL>${errorUrl}</Hata_URL>\n
                    <Basarili_URL>${successUrl}</Basarili_URL>\n
                    <Siparis_ID>${siparisId}</Siparis_ID>\n
                    <Siparis_Aciklama>${siparisAciklama}</Siparis_Aciklama>\n
                    <Taksit>1</Taksit>\n
                    <Islem_Tutar>${subsellersShare}</Islem_Tutar>\n
                    <Toplam_Tutar>${price}</Toplam_Tutar>\n
                    <Islem_Hash>${hashValue}</Islem_Hash>\n
                    <Islem_Guvenlik_Tip>${paymentType}</Islem_Guvenlik_Tip>\n
                    <IPAdr>127.0.0.1</IPAdr>\n
                    <Ref_URL>${refUrl}</Ref_URL>\n
                </TP_WMD_UCD>\n
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
                            const sonuc = result["soap:Envelope"]["soap:Body"][0]["TP_WMD_UCDResponse"][0]["TP_WMD_UCDResult"][0]["Sonuc"][0];
                            const sonucStr = result["soap:Envelope"]["soap:Body"][0]["TP_WMD_UCDResponse"][0]["TP_WMD_UCDResult"][0]["Sonuc_Str"][0];
                            const islemId = result["soap:Envelope"]["soap:Body"][0]["TP_WMD_UCDResponse"][0]["TP_WMD_UCDResult"][0]["Islem_ID"][0];
                            const UCD_HTML = result["soap:Envelope"]["soap:Body"][0]["TP_WMD_UCDResponse"][0]["TP_WMD_UCDResult"][0]["UCD_HTML"][0];
                            const Bank_Trans_ID = result["soap:Envelope"]["soap:Body"][0]["TP_WMD_UCDResponse"][0]["TP_WMD_UCDResult"][0]["Bank_Trans_ID"][0];
                            const Bank_AuthCode = result["soap:Envelope"]["soap:Body"][0]["TP_WMD_UCDResponse"][0]["TP_WMD_UCDResult"][0]["Bank_AuthCode"][0];
                            const Banka_Sonuc_Kod = result["soap:Envelope"]["soap:Body"][0]["TP_WMD_UCDResponse"][0]["TP_WMD_UCDResult"][0]["Banka_Sonuc_Kod"][0];
                            

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

export default paramPayRequest;