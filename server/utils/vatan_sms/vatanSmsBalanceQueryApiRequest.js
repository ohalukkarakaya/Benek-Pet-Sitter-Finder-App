import axios from "axios";
import iconv from "iconv-lite";
import dotenv from "dotenv";

dotenv.config();

const vatanSmsBalanceQueryApiRequest = async() => {
    return new Promise(
        async ( resolve, reject ) => {
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${ 
                        process.env
                            .VATAN_SMS_BALANCE_QUERY_API_URL
                    }?kul_ad=${
                        process.env
                            .VATAN_SMS_API_USER_ID
                    }&sifre=${
                        process.env
                            .VATAN_SMS_API_PASSWORD
                    }`,
            };

            try{
                const response = await axios.request( config );

                const responseBuffer = response.data;
                const responseText = iconv.decode( responseBuffer, 'iso-8859-9' );

                const smsBirimFiyatRegex = /SMS Birim Fiyatı=([\d.]+)/;
                const kalanBakiyeRegex = /Kalan Bakiye=([\d.]+)/;

                const smsBirimFiyatMatch = responseText.match(
                                                            smsBirimFiyatRegex
                                                        );
                const kalanBakiyeMatch = responseText.match(
                                                        kalanBakiyeRegex
                                                      );

                const smsBirimFiyat = smsBirimFiyatMatch 
                                                ? parseFloat(
                                                    smsBirimFiyatMatch[ 1 ]
                                                  ) 
                                                : -1;

                const kalanBakiye = kalanBakiyeMatch 
                                                ? parseFloat(
                                                    kalanBakiyeMatch[ 1 ]
                                                  ) 
                                                : -1;

                resolve(
                    {
                            smsBirimFiyat: smsBirimFiyat,
                            kalanBakiye: kalanBakiye
                    } 
                );
            }catch( err ){
                console.log( "ERROR: vatanSmsApiRequest - ", error );
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

export default vatanSmsBalanceQueryApiRequest;