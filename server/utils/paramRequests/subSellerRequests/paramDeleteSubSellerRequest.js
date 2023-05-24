import axios from "axios";
import xml2js from "xml2js";
import dotenv from "dotenv";

dotenv.config();

const paramDeleteSubSellerRequest = async (
    careGiverGUID
) => {

    //send xml soap request to param
    const soapRequest = `<?xml version="1.0" encoding="utf-8"?> <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
        <Pazaryeri_TP_AltUyeIsyeri_Silme xmlns="https://turkpos.com.tr/">
            <G>
                <CLIENT_CODE>${process.env.PARAM_CLIENT_CODE}</CLIENT_CODE>
                <CLIENT_USERNAME>${process.env.PARAM_CLIENT_USERNAME}</CLIENT_USERNAME>
                <CLIENT_PASSWORD>${process.env.PARAM_CLIENT_PASSWORD}</CLIENT_PASSWORD>
            </G> 
            <GUID_AltUyeIsyeri>${careGiverGUID}</GUID_AltUyeIsyeri>
        </Pazaryeri_TP_AltUyeIsyeri_Silme>
        </soap:Body>
    </soap:Envelope>`;

    const config = {
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
      }
    };

    axios.post(
        process.env.PARAM_TEST_URL,
        soapRequest,
        config
    ).then(
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
                        const sonuc = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_AltUyeIsyeri_EklemeResponse"][0]["Pazaryeri_TP_AltUyeIsyeri_EklemeResult"][0]["Sonuc"][0];
                        const sonucStr = result["soap:Envelope"]["soap:Body"][0]["Pazaryeri_TP_AltUyeIsyeri_EklemeResponse"][0]["Pazaryeri_TP_AltUyeIsyeri_EklemeResult"][0]["Sonuc_Str"][0];

                        response = {
                            error: false,
                            data: {
                                sonuc: sonuc,
                                sonucStr: sonucStr,
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
            console.log( err );

            const response = {
                error: true,
                data: {
                    sonucStr: "function error",
                }
            }

            return response;
        }
    );
}

export default paramDeleteSubSellerRequest;