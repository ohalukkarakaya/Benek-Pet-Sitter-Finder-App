import formatDate from "../dateFormater.js";

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const vatanSmsApiRequest = async ( 
    otp, 
    phone,
    smsType,
    lng 
) => {
    return new Promise(
        async (
            resolve, 
            reject
        ) => {
            if(
                !otp
                || !phone
                || (
                    lng !== "Tr"
                    && lng !== "En"
                )
            ){
                reject(
                    {
                        error: true,
                        status: 400,
                        message: "Missing Param",
                    }
                );
            }
        
            if(
                !smsType
                || smsType === null
            ){
                smsType = "Normal";
            }
        
            let message;
            if( lng === "Tr" ){
                message = `Benek App Onay Kodunuz: ${ otp }`;
            }else{
                message = `Your Benek App Verification Code: ${ otp }`;
            }
        
            const now = new Date();
            const currentDate = formatDate( now );
        
            now.setMinutes( now.getMinutes() + 10 );
            const tenMinutesLater = formatDate( now );
        
            let xmlData = `data=
                            <sms>
                                <kno>${ process.env.VATAN_SMS_API_CLIENT_ID }</kno>
                                <kulad>${ process.env.VATAN_SMS_API_USER_ID }</kulad>
                                <sifre>${ process.env.VATAN_SMS_API_PASSWORD }</sifre>
                                <tur>${ smsType }</tur>
                                <gonderen>SMS TEST</gonderen>
                                <mesaj>${ message }</mesaj> 
                                <numaralar>${ phone }</numaralar>
                                <zaman>${ currentDate }</zaman>
                                <zamanasimi>${ tenMinutesLater }</zamanasimi>
                            </sms>`;
        
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: process.env.VATAN_SMS_TEST_API_URL,
                headers: { 
                    'Content-Type': 'text/plain'
                },
                data : xmlData
            };

            try{
                const responseData = await axios.request( config );
                const responses = responseData.data
                                              .toString()
                                              .split(":");

                const serverStatus = parseInt( responses[ 0 ] );
                if( responses.length < 3 ){
                    resolve(
                        {
                            error: true,
                            serverStatus: serverStatus,
                            message: responses[ 1 ]
                        }
                    )
                }

                resolve(
                    {
                        error: false,
                        serverStatus: serverStatus,
                        smsId: responses[ 1 ],
                        message: responses[ 2 ],
                        sendedUserCount: parseInt( responses[ 3 ] ),
                        usedCredit: parseFloat( responses[ 4 ] )
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
        

export default vatanSmsApiRequest;