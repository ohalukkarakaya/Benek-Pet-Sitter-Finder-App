import User from "../../models/User.js";
import PhoneOtpVerification from "../../models/UserSettings/PhoneOTPVerification.js";

import vatanSmsApiRequest from "./vatanSmsApiRequest.js";

import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const vatanSmsSendValidationOtp = async ( res, phoneNumber, id ) => {
    try{
        const otp = `${
            Math.floor(
                    100000 
                    + Math.random() 
                    * 900000
                 )
         }`;

      //hesh the otp
      const salt = await bcrypt.genSalt(
                                    Number(
                                        process.env
                                               .SALT
                                    )
                                );

      const hashedOtp = await bcrypt.hash(
                                        otp, 
                                        salt
                                     );

      const newOtpVerification = await new PhoneOtpVerification(
                                              {
                                                userId: id,
                                                phoneNumber: phoneNumber,
                                                otp: hashedOtp,
                                              }
                                           );

      //save otp record
      await newOtpVerification.save();

     let smsRequest = await vatanSmsApiRequest(
                                otp,
                                phoneNumber,
                                "Normal",
                                "Tr"
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
  try{
    const OTPVerificationRecords = await PhoneOtpVerification.find(
                                                  {
                                                    userId,
                                                    phoneNumber
                                                  }
                                              );

    if( OTPVerificationRecords.length <= 0 ){
      //no record found
      return res.status( 404 )
                .json(
                    {
                      error: true,
                      message: "Account record doesn't exist or has been verified already"
                    }
                );
    }
    //user otp record exists
    const expiresAt = OTPVerificationRecords[ 0 ].expiresAt;
    const hashedOTP = OTPVerificationRecords[ 0 ].otp;

    if( 
      expiresAt < Date.now()
    ){
      await PhoneOtpVerification.deleteMany(
                                     { 
                                        userId
                                     }
                                 );

      return res.status( 405 )
                .json(
                    {
                      error: true,
                      message: "Code has expired. Please request again"
                    }
                );
    }

     const isOTPValid = await bcrypt.compare(
      otp, 
      hashedOTP
    );

    if( !isOTPValid ){
      //supplied OTP is wrong
        return res.status( 406 )
                  .json(
                      {
                        error: true,
                        message: "Invalid code passed."
                      }
                  );
    }

    User.findByIdAndUpdate(
      userId,
      {
          phone: `+9${ phoneNumber }`,
          isPhoneVerified: true
      }
    ).then(
        async ( user ) => {
          if( 
              !user
              || user.deactivation
                    .isDeactive
          ){
            return res.status( 404 )
                      .json(
                        {
                          error: true,
                          message: "User not found"
                        }
                      );
          }
                              
          await PhoneOtpVerification.deleteMany(
                                        {
                                          userId
                                        }
                                     ).then(
                                        (_) => {
                                          if( user.careGiveGUID ){
                                            const paramRequest = paramUpdateSubSellerRequest(
                                              user.careGiveGUID,
                                              null,
                                              null,
                                              null,
                                              null,
                                              user.phone,
                                              null,
                                              null
                                            );

                                            if( !paramRequest ){
                                              return res.status( 500 )
                                                        .json(
                                                          {
                                                            error: true,
                                                            message: "Internal server error"
                                                          }
                                                        );
                                            }
                                    
                                            if( paramRequest.error ){
                                              return res.status( 500 )
                                                        .json(
                                                          {
                                                            error: true,
                                                            message: paramRequest.data.sonucStr
                                                          }
                                                        );
                                            }
                                    
                                            if( paramRequest.sonuc !== "1" ){
                                              return res.status( 500 )
                                                        .json(
                                                          {
                                                            error: true,
                                                            message: "Internal server error",
                                                            data: paramRequest.data.sonucStr
                                                          }
                                                        );
                                            }
                                          }
                                          return res.status( 200 )
                                                    .json(
                                                      {
                                                        error: false,
                                                        message: "phone verified succesfully",
                                                        phoneNumber: "+9" + phoneNumber
                                                      }
                                                    );
                                        }
                                     ).catch(
                                        ( error ) => {

                                          console.log( error );
                                          return res.status( 500 )
                                                    .json(
                                                      {
                                                        error: true,
                                                        message: "An error occured while deleting",
                                                        error: error
                                                      }
                                                    );
                                        }
                                     );
        }
    ).catch(
        ( e ) => {
            console.log( e );
            return res.status( 500 )
                      .json(
                          {
                            error: true,
                            message: "An error occured while saving",
                            error: e
                          }
                      );
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

export { vatanSmsSendValidationOtp, vatanSmsVerifyOtp };