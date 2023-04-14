import axios from "axios";
import xml2js from "xml2js";
import dotenv from "dotenv";

dotenv.config();

const paramRegisterCreditCardRequest = async (
    firstName,
    middleName,
    lastName,
    cardNo,
    CardExpiryMonth,
    CardExpiryYear,
    CardName,
) => {

    const name = [
        firstName,
        middleName,
        lastName,
    ];
    
    const fullName = name.join(" ");

    let data = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>\n
                <KS_Kart_Ekle xmlns="https://turkpara.com.tr/">\n
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
                    <KK_Kart_Adi>${CardName}</KK_Kart_Adi>\n
                    <KK_Islem_ID></KK_Islem_ID>\n
                </KS_Kart_Ekle>\n
            </soap:Body>\n
        </soap:Envelope>`;

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: process.env.PARAM_CARD_REGISTER_TEST_URL,
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
                            const sonuc = result["soap:Envelope"]["soap:Body"][0]["KS_Kart_EkleResponse"][0]["KS_Kart_EkleResult"][0]["Sonuc"][0];
                            const sonucStr = result["soap:Envelope"]["soap:Body"][0]["KS_Kart_EkleResponse"][0]["KS_Kart_EkleResult"][0]["Sonuc_Str"][0];
                            const ksGuid = result["soap:Envelope"]["soap:Body"][0]["KS_Kart_EkleResponse"][0]["KS_Kart_EkleResult"][0]["KS_GUID"][0];
    
                            response = {
                                error: false,
                                data: {
                                    sonuc: sonuc,
                                    sonucStr: sonucStr,
                                    ksGuid: ksGuid
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

export default paramRegisterCreditCardRequest;
