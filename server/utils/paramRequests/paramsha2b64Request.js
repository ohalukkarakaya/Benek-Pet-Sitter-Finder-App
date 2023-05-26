import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const paramsha2b64Request = async (
    data
) => {
    return new Promise(
        async ( 
            resolve,
            reject
        ) => {
            let requestData = `<?xml version="1.0" encoding="utf-8"?> 
                <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                    <soap:Body>\n
                        <SHA2B64 xmlns="https://turkpos.com.tr/">\n
                            <Data>${data}</Data>\n
                        </SHA2B64>\n
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
                url: process.env.PARAM_TEST_URL,
                headers: { 
                    'Content-Type': 'text/xml;charset=UTF-8'
                },
                data : requestData
             };

             try{
                const serverResponse = await axios.request( config );

                let response

                xml2js.parseString(
                    serverResponse.data,
                    ( err, result ) => {
    
                        if( err ){
                            console.log( err );
                            response = {
                                error: true,
                            };
    
                            reject( response );
                        } else {
                            const routePath = result[ "soap:Envelope" ]
                                                    [ "soap:Body" ]
                                                    [ 0 ]
                                                    [ "SHA2B64Response" ]
                                                    [ 0 ];

                            const SHA2B64Result = routePath[ "SHA2B64Result" ]
                                                           [ 0 ]
                                                           [ "_" ];
    
                            response = {
                                error: false,
                                data: {
                                    sha2b64result: SHA2B64Result
                                }
                            }
    
                            if( !SHA2B64Result ){
                                response.error = true;
                            }
                            
                            resolve( response );
                        }
                    }
                );

             }catch( err ){
                console.log( "ERROR: paramsha2b64Request - ", err );
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

export default paramsha2b64Request;
