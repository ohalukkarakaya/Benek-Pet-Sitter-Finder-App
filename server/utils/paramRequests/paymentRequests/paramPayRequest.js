import axios from "axios";
import { json } from "body-parser";
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
            ( response ) => {
                return JSON.stringify( response.data );
            }
        ).catch(
            ( error ) => {
                console.log(error);
            }
        );
}

export default paramPayRequest;