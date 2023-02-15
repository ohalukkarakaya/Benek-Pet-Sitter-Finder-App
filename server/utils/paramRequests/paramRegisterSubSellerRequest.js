import axios from "axios";
import xml2js from "xml2js";
import dotenv from "dotenv";

dotenv.config();

const paramRegisterSubSellerRequest = async (
    firstName,
    middleName,
    lastName,
    birthday,
    nationalIdNo,
    phoneNumber,
    openAdress
) => {

    const name = [
        firstName,
        middleName,
        lastName,
    ];
    
    const fullName = name.join(" ");

    //send xml soap request to param
    const soapRequest = `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"> 
        <soap:Body>
            <Pazaryeri_TP_AltUyeIsyeri_Ekleme xmlns="https://turkpos.com.tr/">
                <G>
                    <CLIENT_CODE>${process.env.PARAM_CLIENT_CODE}</CLIENT_CODE>
                    <CLIENT_USERNAME>${process.env.PARAM_CLIENT_USERNAME}</CLIENT_USERNAME>
                    <CLIENT_PASSWORD>${process.env.PARAM_CLIENT_PASSWORD}</CLIENT_PASSWORD>
                </G> 
                <ETS_GUID>${process.env.PARAM_GUID}</ETS_GUID>
                <Tip>1</Tip>
                <Ad_Soyad>${fullName}</Ad_Soyad>
                <Unvan>Benek Bakıcı</Unvan>
                <TC_VN>${nationalIdNo}</TC_VN>
                <Kisi_DogumTarihi>${birthday}</Kisi_DogumTarihi>
                <GSM_No>${phoneNumber}</GSM_No>
                <IBAN_No>${iban}</IBAN_No>
                <IBAN_Unvan>${fullName}</IBAN_Unvan>
                <Adres>${openAdress}</Adres>
                <Il>${process.env.MERSIS_IL_KOD}</Il>
                <Ilce>${process.env.MERSIS_ILCE_KOD}</Ilce>
                <Vergi_Daire>${process.env.VERGI_DAIRE_KOD}</Vergi_Daire>
            </Pazaryeri_TP_AltUyeIsyeri_Ekleme>
        </soap:Body>
        </soap:Envelope>`;

    const config = {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': 'https://turkpos.com.tr/Pazaryeri_TP_AltUyeIsyeri_Ekleme',
      }
    };

    axios.post(
        process.env.PARAM_TEST_URL,
        soapRequest,
        config)
    .then(
        serverResponse => {
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
                        const sonuc = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_AltUyeIsyeri_EklemeResponse"][0]["Pazaryeri_TP_AltUyeIsyeri_EklemeResult"][0]["Sonuc"][0];
                        const sonucStr = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_AltUyeIsyeri_EklemeResponse"][0]["Pazaryeri_TP_AltUyeIsyeri_EklemeResult"][0]["Sonuc_Str"][0];
                        const guidAltUyeIsyeri = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_AltUyeIsyeri_EklemeResponse"][0]["Pazaryeri_TP_AltUyeIsyeri_EklemeResult"][0]["GUID_AltUyeIsyeri"][0];

                        response = {
                            error: false,
                            data: {
                                sonuc: sonuc,
                                sonucStr: sonucStr,
                                guidAltUyeIsyeri: guidAltUyeIsyeri
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
        error => {
            console.log(err);

            const response = {
                error: true,
                data: {
                    sonucStr: "function error",
                }
            }
        }
    );
}

export default paramRegisterSubSellerRequest;