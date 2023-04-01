import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const paramAddDetailToOrder = async (
    price,
    commission,
    orderId,
    subSellerGuid
) => {

    var subsellersShare = price - commission;

    let data = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n
            <soap:Body>\n
                <Pazaryeri_TP_Siparis_Detay_Ekle xmlns="https://turkpos.com.tr/">\n
                    <G>\n
                        <CLIENT_CODE>${process.env.PARAM_CLIENT_CODE}</CLIENT_CODE>\n
                        <CLIENT_USERNAME>${process.env.PARAM_CLIENT_USERNAME}</CLIENT_USERNAME>\n
                        <CLIENT_PASSWORD>${process.env.PARAM_CLIENT_PASSWORD}</CLIENT_PASSWORD>\n
                    </G>\n
                    <GUID>${process.env.PARAM_GUID}</GUID>\n
                    <Tutar_Urun>${price}</Tutar_Urun>\n
                    <Tutar_Odenecek>${subsellersShare}</Tutar_Odenecek>\n
                    <SanalPOS_Islem_ID>${orderId}</SanalPOS_Islem_ID>\n
                    <GUID_AltUyeIsyeri>${subsellerGuid}</GUID_AltUyeIsyeri>\n
                </Pazaryeri_TP_Siparis_Detay_Ekle>\n
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

export default paramAddDetailToOrder;