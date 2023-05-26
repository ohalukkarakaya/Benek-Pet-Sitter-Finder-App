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

    return new Promise(
        async(
            resolve,
            reject
        ) => {
            const name = [
                firstName,
                middleName,
                lastName,
            ];
            
            const fullName = name.join(" ")
                                .replaceAll("undefined", "")
                                .replaceAll("  ", " ");

            //send xml soap request to param
            const soapRequest = `<?xml version="1.0" encoding="utf-8"?> <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                    <Pazaryeri_TP_AltUyeIsyeri_Guncelleme xmlns="https://turkpos.com.tr/">
                        <G>
                            <CLIENT_CODE>${ process.env.PARAM_CLIENT_CODE }</CLIENT_CODE>
                            <CLIENT_USERNAME>${ process.env.PARAM_CLIENT_USERNAME }</CLIENT_USERNAME>
                            <CLIENT_PASSWORD>${ process.env.PARAM_CLIENT_PASSWORD }</CLIENT_PASSWORD>
                        </G> 
                        <GUID_AltUyeIsyeri>${ guid }</GUID_AltUyeIsyeri>`
                        + ( fullName.replace(/\s+/g, '') !== ' ' ) 
                                ? `<Ad_Soyad>${ fullName }</Ad_Soyad>` 
                                : "" 
                        + ( phoneNumber.replace(/\s+/g, '') !== ' ' ) 
                                ? `<GSM_No>${ phoneNumber }</GSM_No>` 
                                : ""
                        + ( iban.replace(/\s+/g, '') !== ' ' ) 
                                ? `<IBAN_No>${ iban }</IBAN_No>` 
                                : ""
                        + ( openAdress.replace(/\s+/g, '') !== ' ' ) 
                                ? `<Adres>${ openAdress }</Adres>` 
                                : ""
                        + ( email.replace(/\s+/g, '') !== ' ' ) 
                                ? `<EPosta>${ email }</EPosta>` 
                                : ""
                    + `</Pazaryeri_TP_AltUyeIsyeri_Guncelleme>
                </soap:Body>
            </soap:Envelope>`;

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: process.env
                            .PARAM_TEST_URL,
                headers: {
                  'Content-Type': 'text/xml;charset=UTF-8',
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
                const serverResponse = axios.request( config );

                xml2js.parseString(
                    serverResponse.data,
                    ( err, result ) => {
    
                        if(err){
                            console.log(err);
                            response = {
                                error: true,
                            };
    
                            resolve( response );
                        } else {
                            const routePath = result[ "soap:Envelope" ]
                                                    [ "soap:Body" ]
                                                    [ 0 ]
                                                    [ "Pazaryeri_TP_AltUyeIsyeri_GuncellemeResponse" ]
                                                    [ 0 ]
                                                    [ "Pazaryeri_TP_AltUyeIsyeri_GuncellemeResult" ]
                                                    [ 0 ];

                            const sonuc = routePath[ "Sonuc" ]
                                                   [ 0 ]
                                                   [ "_" ];

                            const sonucStr = routePath[ "Sonuc_Str" ]
                                                      [ 0 ]
                                                      [ "_" ];
    
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
                            
                            resolve( response );
                        }
                    }
                );
            }catch( err ){
                console.log( "ERROR: paramUpdateSubSellerRequest - ", err );
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

export default paramUpdateSubSellerRequest;