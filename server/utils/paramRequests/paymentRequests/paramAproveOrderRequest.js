import axios from "axios";
import xml2js from "xml2js";
import dotenv from "dotenv";

dotenv.config();

const paramAproveOrderRequest = async (
    orderGuid
) => {

    var subsellersShare = price - commission;

    let data = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n
            <soap:Body>\n
                <Pazaryeri_TP_Siparis_Onay xmlns="https://turkpos.com.tr/">\n
                    <G>\n
                        <CLIENT_CODE>${process.env.PARAM_CLIENT_CODE}</CLIENT_CODE>\n
                        <CLIENT_USERNAME>${process.env.PARAM_CLIENT_USERNAME}</CLIENT_USERNAME>\n
                        <CLIENT_PASSWORD>${process.env.PARAM_CLIENT_PASSWORD}</CLIENT_PASSWORD>\n
                    </G>\n
                    <PYSiparis_GUID>${orderGuid}</PYSiparis_GUID>\n
                    <Durum>1</Durum>\n
                </Pazaryeri_TP_Siparis_Onay>\n
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
                            const sonuc = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_Siparis_OnayResponse"][0]["Pazaryeri_TP_Siparis_OnayResult"][0]["Sonuc"][0];
                            const sonucStr = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_Siparis_OnayResponse"][0]["Pazaryeri_TP_Siparis_OnayResult"][0]["Sonuc_Str"][0];
                            const POS_Islem_Id = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_Siparis_OnayResponse"][0]["Pazaryeri_TP_Siparis_OnayResult"][0]["POS_Islem_Id"][0];
                            const GUID_AltUyeIsyeri = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_Siparis_OnayResponse"][0]["Pazaryeri_TP_Siparis_OnayResult"][0]["GUID_AltUyeIsyeri"][0];
                            const Tutar_Urun = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_Siparis_OnayResponse"][0]["Pazaryeri_TP_Siparis_OnayResult"][0]["Tutar_Urun"][0];
                            const Tutar_Odenecek = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_Siparis_OnayResponse"][0]["Pazaryeri_TP_Siparis_OnayResult"][0]["Tutar_Odenecek"][0];
                            const Durum = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_Siparis_OnayResponse"][0]["Pazaryeri_TP_Siparis_OnayResult"][0]["SanalPOS_Islem_ID"][0];
                            const Toplam_Tahsilat_Tutari = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_Siparis_OnayResponse"][0]["Pazaryeri_TP_Siparis_OnayResult"][0]["Durum"][0];
                            const Durum_Str = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_Siparis_OnayResponse"][0]["Pazaryeri_TP_Siparis_OnayResult"][0]["Durum_Str"][0];
                            

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

export default paramAproveOrderRequest;