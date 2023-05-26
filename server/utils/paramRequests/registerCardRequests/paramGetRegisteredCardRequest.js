import axios from "axios";
import xml2js from "xml2js";
import dotenv from "dotenv";

dotenv.config();

const paramGetRegisteredCreditCard = async ( kkGuid ) => {

    return new Promise(
        async (
            resolve,
            reject
        ) => {
            let data = `<?xml version="1.0" encoding="utf-8"?> 
                <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                    <soap:Body>\n
                        <KS_Kart_Liste xmlns="https://turkpara.com.tr/">\n
                            <G>\n
                                <CLIENT_CODE>${process.env.PARAM_CLIENT_CODE}</CLIENT_CODE>\n
                                <CLIENT_USERNAME>${process.env.PARAM_CLIENT_USERNAME}</CLIENT_USERNAME>\n
                                <CLIENT_PASSWORD>${process.env.PARAM_CLIENT_PASSWORD}</CLIENT_PASSWORD>\n
                            </G>\n
                            <GUID>${process.env.PARAM_GUID}</GUID>\n
                            <KK_GUID>${kkGuid}</KK_GUID>\n
                            <KK_Islem_ID></KK_Islem_ID>\n
                        </KS_Kart_Liste>\n
                    </soap:Body>\n
                </soap:Envelope>`;

            if(
                process.env
                       .ENVIROMENT === 'TEST'
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

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: process.env.PARAM_CARD_REGISTER_TEST_URL,
                headers: { 
                    'Content-Type': 'text/xml;charset=UTF-8'
                },
                data : data
            };

            try{
                const serverResponse = await axios.request( config );
                let response;

                xml2js.parseString(
                    serverResponse.data,
                    ( err, result ) => {

                        if( err ){
                            console.log(err);
                            response = {
                                error: true,
                            };

                            reject( response );
                        }
                        
                        const routePath = result[ "soap:Envelope" ]
                                                [ "soap:Body" ]
                                                [ 0 ]
                                                [ "KS_Kart_ListeResponse" ]
                                                [ 0 ]
                                                [ "KS_Kart_ListeResult" ]
                                                [ 0 ];

                        const sonuc = routePath[ "Sonuc" ]
                                               [ 0 ]
                                               [ "_" ];

                        const sonucStr = routePath[ "Sonuc_Str" ]
                                                  [ 0 ]
                                                  [ "_" ];

                        const DTBilgi = JSON.stringify( result.NewDataSet );

                        response = {
                            error: false,
                            data: {
                                sonuc: sonuc,
                                sonucStr: sonucStr,
                                DTBilgi: DTBilgi
                            }
                        }

                        if( sonuc !== "1" ){
                            response.error = true;
                        }
                            
                        resolve( response );
                    }
                );
            }catch( err ){
                console.log( "ERROR: paramGetRegisteredCreditCard - ", err );
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

export default paramGetRegisteredCreditCard;



