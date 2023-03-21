import axios from "axios";
import xml2js from "xml2js";
import dotenv from "dotenv";

dotenv.config();

const paramUpdateSubSellerRequest = async (
    guid,
    firstName,
    middleName,
    lastName,
    email,
    phoneNumber,
    openAdress,
    iban
) => {

    const name = [
        firstName,
        middleName,
        lastName,
    ];
    
    const fullName = name.join(" ");

    //send xml soap request to param
    const soapRequest = `<?xml version="1.0" encoding="utf-8"?> <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
            <Pazaryeri_TP_AltUyeIsyeri_Guncelleme xmlns="https://turkpos.com.tr/">
                <G>
                    <CLIENT_CODE>${process.env.PARAM_CLIENT_CODE}</CLIENT_CODE>
                    <CLIENT_USERNAME>${process.env.PARAM_CLIENT_USERNAME}</CLIENT_USERNAME>
                    <CLIENT_PASSWORD>${process.env.PARAM_CLIENT_PASSWORD}</CLIENT_PASSWORD>
                </G> 
                <GUID_AltUyeIsyeri>${guid}</GUID_AltUyeIsyeri>`
                + ( fullName.replace(/\s+/g, '') !== null ) ? `<Ad_Soyad>${fullName}</Ad_Soyad>` : "" 
                + ( phoneNumber.replace(/\s+/g, '') !== null ) ? `<GSM_No>${phoneNumber}</GSM_No>` : ""
                + ( iban.replace(/\s+/g, '') !== null ) ? `<IBAN_No>${iban}</IBAN_No>` : ""
                + ( openAdress.replace(/\s+/g, '') !== null ) ? `<Adres>${openAdress}</Adres>` : ""
                + ( email.replace(/\s+/g, '') !== null ) ? `<EPosta>${email}</EPosta>` : ""
            + `</Pazaryeri_TP_AltUyeIsyeri_Guncelleme>
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
                        const sonuc = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_AltUyeIsyeri_GuncellemeResponse"][0]["Pazaryeri_TP_AltUyeIsyeri_GuncellemeResult"][0]["Sonuc"][0];
                        const sonucStr = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_AltUyeIsyeri_GuncellemeResponse"][0]["Pazaryeri_TP_AltUyeIsyeri_GuncellemeResult"][0]["Sonuc_Str"][0];

                        response = {
                            error: false,
                            data: {
                                sonuc: sonuc,
                                sonucStr: sonucStr
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

export default paramUpdateSubSellerRequest;