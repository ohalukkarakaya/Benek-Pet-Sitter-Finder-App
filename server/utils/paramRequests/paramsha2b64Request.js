import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const paramsha2b64Request = async (
    data
) => {
    let data = `<?xml version="1.0" encoding="utf-8"?> 
                <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                    <soap:Body>\n
                        <SHA2B64 xmlns="https://turkpos.com.tr/">\n
                            <Data>${data}</Data>\n
                        </SHA2B64>\n
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

                axios.request (config ).then(
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
                                    const SHA2B64Result = result["soap:Envelope"]["soap:Body"][0]["SHA2B64Response"][0]["SHA2B64Result"][0];
            
                                    response = {
                                        error: false,
                                        data: {
                                            sha2b64result: SHA2B64Result
                                        }
                                    }
            
                                    if( !SHA2B64Result ){
                                        response.error = true;
                                    }
                                    
                                    return response;
                                }
                            }
                        );
                    }
                ).catch(
                    ( error ) => {
                        console.log( error );
                    }
                );
}

export default paramsha2b64Request;
