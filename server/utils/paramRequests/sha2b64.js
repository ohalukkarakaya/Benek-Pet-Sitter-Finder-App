const axios = require('axios');

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
                    url: 'https://test-dmz.param.com.tr/turkpos.ws/service_turkpos_test.asmx',
                    headers: { 
                        'Content-Type': 'text/xml;charset=UTF-8'
                    },
                    data : data
                };

                axios.request (config ).then(
                    ( response ) => {
                        return JSON.stringify( response.data );
                    }
                ).catch(
                    ( error ) => {
                        console.log( error );
                    }
                );
}

export default paramsha2b64Request;
