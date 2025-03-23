import ttmobilSmsGetToken from "./ttmobilSmsGetToken.js";
import axios from "axios";


const ttmobilSmsApiRequest = async (
    otp,
    phone,
    smsType,
    lng,
    isEmergencyMessage
) => {
    return new Promise(
        async ( resolve, reject ) => {
            try{
                if( !otp || !phone || ( lng !== "Tr" && lng !== "En" ) ){
                    reject(
                        {
                            error: true,
                            status: 400,
                            message: "Missing Param"
                        }
                    );
                }

                if( !smsType ){
                    smsType = "Normal";
                }

                let message;
                if( lng === "Tr" && !isEmergencyMessage ){
                    message = `Benek App Onay Kodunuz: ${ otp }`;
                }else if( !isEmergencyMessage ){
                    message = `Your Benek App Verification Code: ${ otp }`;
                }else{
                    message = otp
                }

                const ttmobil_api_url = process.env.TTMOBIL_API_URL;

                const ttmobil_username = process.env.TTMOBIL_API_USERNAME;
                const ttmobil_password_token = process.env.TTMOBIL_API_PASSWORD_TOKEN;
                const ttmobil_password = process.env.TTMOBIL_API_PASSWORD;
                const ttmobil_origin = process.env.TTMOBIL_API_ORIGIN;

                const rawAccessToken = await ttmobilSmsGetToken(
                    ttmobil_api_url,
                    ttmobil_username,
                    ttmobil_password_token
                );

                const accessToken = "Bearer " + rawAccessToken;

                const path = ttmobil_api_url + "/api/Otp/SendSms";

                const header = {
                    Authorization: accessToken
                };

                const data = {
                    username: ttmobil_username,
                    password: ttmobil_password,
                    number: phone,
                    messageText: message,
                    origin: ttmobil_origin,
                    sendDate: "",
                    endDate: ""
                };

                const config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: path,
                    headers: header,
                    data: data
                };

                const response = await axios.request( config );
                if( response.status !== 200 ){
                    reject(
                        {
                            error: true,
                            status: response.status,
                            message: "Internal Server Error"
                        }
                    );
                }

                const responseData = response.data;
                const responseSonuc = responseData.sonuc;

                const parts = responseSonuc.split("*").filter(p => p !== "");
                const sonuc = parts[0];
                const id = parts[1];

                const returnData = {sonuc, id};

                resolve( returnData );

            }catch( err ){
                console.log( "ERROR: ttmobilSmsApiRequest - ", err );
                reject(
                    {
                        error: true,
                        message: "Internal Server Error"
                    }
                );
            }
        }
    );
}

export default ttmobilSmsApiRequest;