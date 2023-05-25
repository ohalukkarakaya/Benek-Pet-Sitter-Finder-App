import axios from "axios";
import xml2js from "xml2js";
import * as https from "https";
import dotenv from "dotenv";

dotenv.config();

const paramRegisterSubSellerRequest = async (
    firstName,
    middleName,
    lastName,
    birthday,
    nationalIdNo,
    phoneNumber,
    openAdress,
    iban
) => {

    return new Promise(
        async (
            resolve,
            reject
        ) => {
            const name = [
                firstName,
                middleName,
                lastName,
            ];

            const fullName = name.join(" ");

            const nationalIdNoLength = 10;
            const paddedNationalIdNo = nationalIdNo.padStart(
                                                        nationalIdNoLength, 
                                                        '0'
                                                    ).replace(
                                                        /[^\d]/g,
                                                        '0'
                                                      );

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
                        <TC_VN>${paddedNationalIdNo}</TC_VN>
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
                method: 'post',
                maxBodyLength: Infinity,
                url: process.env.PARAM_TEST_URL,
                headers: {
                  'Content-Type': 'text/xml;charset=UTF-8',
                  'SOAPAction': 'https://turkpos.com.tr/Pazaryeri_TP_AltUyeIsyeri_Ekleme',
                },
                data: soapRequest
            };

            if(
                process.env.ENVIROMENT === 'TEST'
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

            try{
                const responseData = await axios.request( config );
                xml2js.parseString(
                    responseData.data,
                    (err, result) => {
    
                        if( err ){
                            console.log( err );
                            let response = {
                                error: true,
                            };
    
                            reject( response );
                        } else {
                            const routePath = result[ "soap:Envelope" ][ "soap:Body" ]
                                                                       [ 0 ]
                                                                       [ "Pazaryeri_TP_AltUyeIsyeri_EklemeResponse" ]
                                                                       [ 0 ]
                                                                       [ "Pazaryeri_TP_AltUyeIsyeri_EklemeResult" ]
                                                                       [ 0 ]
                            let sonuc = routePath[ "Sonuc" ]
                                                 [ 0 ]
                                                 [ "_" ];

                            let sonucStr = routePath[ "Sonuc_Str" ]
                                                    [ 0 ]
                                                    [ "_" ];

                            let guidAltUyeIsyeri = routePath[ "GUID_AltUyeIsyeri" ]
                                                    ? routePath[ "GUID_AltUyeIsyeri" ]
                                                               [ 0 ]
                                                               [ "_" ]
                                                    : null;
                            
                            let response = {
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
                            
                            resolve( response );
                        }
                    }
                );
            }catch( err ){
                console.log( "ERROR: paramRegisterSubSellerRequest - ", err );
                reject(
                    {
                        error: true,
                        serverStatus: -1,
                        message: "Internal Server Error",
                    }
                );
            }
        }
    );
}

export default paramRegisterSubSellerRequest;