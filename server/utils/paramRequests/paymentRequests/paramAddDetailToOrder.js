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
                    <GUID_AltUyeIsyeri>${subSellerGuid}</GUID_AltUyeIsyeri>\n
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
                            const sonuc = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_Siparis_Detay_EkleResponse"][0]["Pazaryeri_TP_Siparis_Detay_EkleResult"][0]["Sonuc"][0];
                            const sonucStr = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_Siparis_Detay_EkleResponse"][0]["Pazaryeri_TP_Siparis_Detay_EkleResult"][0]["Sonuc_Str"][0];
                            const GUID_AltUyeIsyeri = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_Siparis_Detay_EkleResponse"][0]["Pazaryeri_TP_Siparis_Detay_EkleResult"][0]["GUID_AltUyeIsyeri"][0];
                            const Tutar_Urun = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_Siparis_Detay_EkleResponse"][0]["Pazaryeri_TP_Siparis_Detay_EkleResult"][0]["Tutar_Urun"][0];
                            const Tutar_Odenecek = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_Siparis_Detay_EkleResponse"][0]["Pazaryeri_TP_Siparis_Detay_EkleResult"][0]["Tutar_Odenecek"][0];
                            const PYSiparis_GUID = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_Siparis_Detay_EkleResponse"][0]["Pazaryeri_TP_Siparis_Detay_EkleResult"][0]["PYSiparis_GUID"][0];
                            const SanalPOS_Islem_ID = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_Siparis_Detay_EkleResponse"][0]["Pazaryeri_TP_Siparis_Detay_EkleResult"][0]["SanalPOS_Islem_ID"][0];
                            const Toplam_Tahsilat_Tutari = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_Siparis_Detay_EkleResponse"][0]["Pazaryeri_TP_Siparis_Detay_EkleResult"][0]["Toplam_Tahsilat_Tutari"][0];
                            const Pazaryeri_Limit = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_Siparis_Detay_EkleResponse"][0]["Pazaryeri_TP_Siparis_Detay_EkleResult"][0]["Pazaryeri_Limit"][0];
                            const Yeni_Odenecek_Tutar = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_Siparis_Detay_EkleResponse"][0]["Pazaryeri_TP_Siparis_Detay_EkleResult"][0]["Yeni_Odenecek_Tutar"][0];
                            

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

export default paramAddDetailToOrder;