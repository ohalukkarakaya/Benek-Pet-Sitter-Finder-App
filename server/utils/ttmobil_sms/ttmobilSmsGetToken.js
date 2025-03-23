import axios from "axios";


const ttmobilSmsGetToken = async (
    ttmobil_api_url,
    ttmobil_username,
    ttmobil_password_token
) => {
    return new Promise(
        async ( resolve, reject ) => {
            try {
                const path = ttmobil_api_url + "/ttmesajToken";
                const data = new URLSearchParams({
                    "username": ttmobil_username,
                    "password": ttmobil_password_token,
                    "grant_type": "password"
                });
                const config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: path,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
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
                const access_token = responseData.access_token;
                resolve( access_token );

            }catch( err ){
                console.log( "ERROR: ttmobilSmsGetToken - ", err );
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

export default ttmobilSmsGetToken;