import User from "../../../models/User.js";
import PhoneOtpVerification from "../../../models/UserSettings/PhoneOTPVerification.js";

import { sendOTPVerificationSMS } from "../../../utils/sendValidationSMS.js";
import { addPhoneBodyValidation } from "../../../utils/bodyValidation/user/addPhoneNumberValidationSchema.js";
import { vatanSmsSendValidationOtp } from "../../../utils/vatan_sms/vatanSmsOtpValidation.js";

import dotenv from "dotenv";

dotenv.config();

const insertPhoneNumberController = async (req, res) => {
    try{
        const { error } = addPhoneBodyValidation( req.body );
        if(error){
          console.log( "ERROR: insertPhoneNumberController - ", error );
          return res.status( 500 )
                    .json(
                      {
                        error: true,
                        messaage: "Internal Server Error"
                      }
                    );
        }
  
        let phoneNumber = req.body
                             .phoneNumber;

        let isTurkishNumber = false;
        if( phoneNumber.includes( "+9" ) ){
          isTurkishNumber = true;
        }

        if(
          isTurkishNumber
          && phoneNumber.includes( "05" )
          && phoneNumber.length >= 10 
        ){

          var startIndex = phoneNumber.indexOf( "5" );
          phoneNumber = "0" + phoneNumber.slice( startIndex );

        }else if(
          isTurkishNumber
        ){
          console.log( "Hata: İfade içerisinde '05' bulunamadı." );
          return res.status( 400 )
                    .json(
                      {
                        error: true,
                        message: "Invalid Phone Number"
                      }
                    );
        }

        const isPhoneAlreadyUsed = await User.findOne(
                                                {
                                                  phone: phoneNumber
                                                }
                                              );
        if( isPhoneAlreadyUsed ){
          return res.status( 400 )
                    .json(
                      {
                        error: true,
                        message: "This number already used"
                      }
                    );
        }
  
        const user = await User.findById( req.user._id );
        if(
          !user 
          || user.deactivation
                 .isDeactive
        ){
          return res.status( 404 )
                    .json(
                      {
                        error: true,
                        message: "User couldn't found"
                      }
                    );
        }
  
        await PhoneOtpVerification.deleteMany({ userId: req.user._id.toString() });
        await PhoneOtpVerification.deleteMany({ phoneNumber: phoneNumber });

        
        if( isTurkishNumber ){
          vatanSmsSendValidationOtp(
            res,
            phoneNumber,
            req.user
               ._id
               .toString()
          );
        }else{
          sendOTPVerificationSMS(
              {
                _id: req.user
                        ._id
                        .toString(),
                        
                phone: phoneNumber
              },
              res
          );
        }
        
    }catch( err ){
        console.log( "Error: add phone number", err );
        return res.status( 500 )
                  .json(
                    {
                      error: true,
                      message: "Internal server error"
                    }
                  );
    }
}

export default insertPhoneNumberController;