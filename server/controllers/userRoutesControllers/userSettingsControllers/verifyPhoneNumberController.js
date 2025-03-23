import User from "../../../models/User.js";
import PhoneOtpVerification from "../../../models/UserSettings/PhoneOTPVerification.js";

import { verifyOTPVerificationSMS } from "../../../utils/sendValidationSMS.js";
import { vatanSmsVerifyOtp } from "../../../utils/vatan_sms/vatanSmsOtpValidation.js";
import { verifyPhoneBodyValidation } from "../../../utils/bodyValidation/user/addPhoneNumberValidationSchema.js";

import dotenv from "dotenv";

dotenv.config();

const verifyPhoneNumberController = async (req, res) => {
    try{
        const { error } = verifyPhoneBodyValidation( req.body );
        if( error ){
          console.log( "validation error - ", error );
          return res.status( 400 )
                    .json(
                      {
                        error: true,
                        messaage: error.message
                      }
                    );
        }
  
        let { phoneNumber, otp } = req.body;

        const user = await User.findById( req.user._id );

        let isTurkishNumber = true;
        //if( phoneNumber.includes( "+9" ) ){
          //isTurkishNumber = true;
        //}

        const verificationObjectForServiceCheck = await PhoneOtpVerification.find({ userId: req.user._id.toString() });

        const isForegnSmsService = verificationObjectForServiceCheck[ 0 ].otp === "Foreign Sms Service";

        if(
          isTurkishNumber
          && !isForegnSmsService
          && phoneNumber.includes( "05" )
          && phoneNumber.length >= 10 
        ){

          var startIndex = phoneNumber.indexOf( "5" );
          phoneNumber = "0" + phoneNumber.slice( startIndex );

        }else if(
          isTurkishNumber
          && !isForegnSmsService
        ){
          console.log( "Hata: İfade içerisinde '05' bulunamadı." );
          return res.status( 400 ).json({
            error: true,
            message: "Invalid Phone Number"
          });
        }

        if(
          !user 
          || user.deactivation.isDeactive
        ){
          return res.status( 404 ).json({
            error: true,
            message: "User couldn't found"
          });
        }
  
        const verificationObject = await PhoneOtpVerification.findOne({
            userId: req.user._id.toString(),
            phoneNumber: `9${ phoneNumber }`
          });

        if( !verificationObject ){
          return res.status( 404 ).json({
            error: true,
            message: "Verification didn't request for this phone number"
          });
        }
  
        if( 
          isTurkishNumber
          && !isForegnSmsService
        ){
          vatanSmsVerifyOtp(
            res,
            phoneNumber,
            req.user._id.toString(),
            otp
          );
        }else{
          verifyOTPVerificationSMS(
              {
                _id: req.user._id.toString(),
                phone: phoneNumber,
                otp: otp
              },
              res
          );
        }
        
      }catch(err){
        console.log("Error: add phone number", err);
        return res.status(500).json(
          {
            error: true,
            message: "Internal server error"
          }
        );
      }
}

export default verifyPhoneNumberController;