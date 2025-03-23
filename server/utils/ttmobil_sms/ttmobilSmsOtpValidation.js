import User from "../../models/User.js";
import PhoneOtpVerification from "../../models/UserSettings/PhoneOTPVerification.js";
import ttmobilSmsApiRequest from "./ttmobilSmsApiRequest.js";

import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const ttMobilSmsSendValidationOtp = async ( res, phoneNumber, id ) => {
    try{
        const otp = `${ Math.floor( 100000 + Math.random() * 900000 ) }`;
        //hesh the otp
        const salt = await bcrypt.genSalt( Number( process.env.SALT ) );
        const hashedOtp = await bcrypt.hash( otp, salt );

        const newOtpVerification = await new PhoneOtpVerification({
            userId: id,
            phoneNumber: phoneNumber,
            otp: hashedOtp,
        });

        //save otp record
        await newOtpVerification.save();

        let smsRequest = await ttmobilSmsApiRequest(
            otp,
            phoneNumber,
            "Normal",
            "Tr",
            false
        );
        if( smsRequest.sonuc !== "OK" ){
            console.log( "ERROR: ttMobilSmsSendValidationOtp - ", smsRequest.sonuc );
            return res.status( 500 )
                      .json(
                        {
                            error: true,
                            message: "Internal Server Error"
                        }
                      );
        }

        return res.status( 200 )
            .json(
                {
                    error: false,
                    messageId: smsRequest.id,
                    message: "Verfication Code Sended Succesfully"
                }
            );
    }catch( err ){
        console.log( "ERROR: ttMobilSmsSendValidationOtp - ", err );
        return res.status( 500 )
                  .json(
                    {
                        error: true,
                        message: "Internal Server Error"
                    }
                  );
    }
}

export default ttMobilSmsSendValidationOtp;