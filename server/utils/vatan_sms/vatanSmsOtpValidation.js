import User from "../../models/User.js";
import PhoneOtpVerification from "../../models/UserSettings/PhoneOTPVerification.js";

import vatanSmsApiRequest from "./vatanSmsApiRequest.js";

import bcrypt from "bcrypt";
import dotenv from "dotenv";
import mokaUpdateSubsellerRequest from "../mokaPosRequests/mokaSubsellerRequests/mokaUpdateSubsellerRequest.js";

dotenv.config();

const vatanSmsSendValidationOtp = async ( res, phoneNumber, id ) => {
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

     let smsRequest = await vatanSmsApiRequest(
        otp,
        phoneNumber,
        "Normal",
        "Tr",
        false
     );

    if(
        !smsRequest
        || !( smsRequest.serverStatus )
        || smsRequest.serverStatus !== 1
        || smsRequest.error
    ){
        console.log( "ERROR: vatanSmsSendValidationOtp - ", smsRequest.message );
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
                    message: "Verfication Code Sended Succesfully"
                }
              );
    }catch( err ){
        console.log( "ERROR: vatanSmsSendValidationOtp - ", err );
        return res.status( 500 )
                  .json(
                    {
                        error: true,
                        message: "Internal Server Error"
                    }
                  );
    }
}

const vatanSmsVerifyOtp = async ( 
  res, 
  phoneNumber, 
  userId, 
  otp 
) => {
    try {
        const OTPVerificationRecords = await PhoneOtpVerification.find({
            userId,
            phoneNumber: `9${phoneNumber}`,
        });

        if (OTPVerificationRecords.length <= 0) {
            return res.status(404).json({
                error: true,
                message: "Account record doesn't exist or has been verified already",
            });
        }

        const { expiresAt, otp: hashedOTP } = OTPVerificationRecords[0];

        if (expiresAt < Date.now()) {
            await PhoneOtpVerification.deleteMany({ userId });
            return res.status(405).json({
                error: true,
                message: "Code has expired. Please request again",
            });
        }

        const isOTPValid = await bcrypt.compare(otp, hashedOTP);

        if (!isOTPValid) {
            return res.status(406).json({
                error: true,
                message: "Invalid code passed.",
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                phone: `+9${phoneNumber}`,
                isPhoneVerified: true,
            },
            { new: true } // güncellenmiş user döndürmek için
        );

        if (!user || (user.deactivation && user.deactivation.isDeactive)) {
            return res.status(404).json({
                error: true,
                message: "User not found",
            });
        }

        await PhoneOtpVerification.deleteMany({ userId });

        if (user.careGiveGUID) {
            const paramRequest = await mokaUpdateSubsellerRequest(
                user.careGiveGUID,
                null,
                null,
                null,
                null,
                null,
                `+9${phoneNumber}`,
                null
            );

            if (!paramRequest) {
                return res.status(500).json({
                    error: true,
                    message: "Internal server error",
                });
            }

            if (paramRequest.error) {
                return res.status(500).json({
                    error: true,
                    message: paramRequest.data.sonucStr,
                });
            }

            if (paramRequest.data.sonuc !== "1" && paramRequest.data.sonuc !== 1) {
                return res.status(500).json({
                    error: true,
                    message: "Internal server error",
                    data: paramRequest.data.sonucStr,
                });
            }
        }

        return res.status(200).json({
            error: false,
            message: "phone verified successfully",
            phoneNumber: `+9${phoneNumber}`,
        });
    } catch (err) {
        console.error("ERROR in verifyOtp: ", err);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
};

export { vatanSmsSendValidationOtp, vatanSmsVerifyOtp };