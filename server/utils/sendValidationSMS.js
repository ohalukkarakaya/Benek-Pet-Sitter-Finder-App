import dotenv from "dotenv";
import twilio from "twilio";
import PhoneOtpVerification from "../models/UserSettings/PhoneOTPVerification.js";
import User from "../models/User.js";

import paramUpdateSubSellerRequest from "./paramRequests/subSellerRequests/paramUpdateSubSellerRequest.js";

dotenv.config();

const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

 //send OTP verification
 const sendOTPVerificationSMS = async (
    {
      _id, 
      phone
    }, 
    res, 
    next
  ) => {
    try {
        await twilioClient.verify
                          .services( 
                                process.env
                                       .TWILIO_SERVICE_ID 
                          ).verifications
                           .create(
                               {
                                   to: `+${phone}`,
                                   channel: 'sms'
                               }
                           ).then(
                               (data) => {
                                   new PhoneOtpVerification(
                                       {
                                           userId: _id,
                                           phoneNumber: `+${phone}`,
                                           otp: "Foreign Sms Service"
                                       }
                                   ).save().then(
                                       (result) => {
                                           return res.status(200).send(data);
                                       }
                                   );
                               }
                           );
    }catch(err){
      res.status(500).json(
        {
          error: true,
          message: err.message,
        }
      )
    }
  }

//verify OTP verification
const verifyOTPVerificationSMS = async (
  {
    _id, 
    phone, 
    otp
  }, 
  res, 
  next
) => {
    try {
      const editedPhone = phone.replaceAll( "+", "" );
        await twilioClient.verify
                    .services(
                        process.env
                               .TWILIO_SERVICE_ID
                    ).verificationChecks
                     .create(
                        {
                            to: `+${editedPhone}`,
                            code: otp
                        }
                     ).then(
                        ( data ) => {
                            if( data.status === "approved" ){
                                // console.log(data);
                                User.findByIdAndUpdate(
                                    _id,
                                    {
                                        phone: `+${editedPhone}`,
                                        isPhoneVerified: true
                                    }
                                ).then(
                                    ( user ) => {
                                      if( 
                                          user.deactivation
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
                                      PhoneOtpVerification.deleteMany(
                                                            {
                                                              userId: _id
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
                                                                            phoneNumber: "+" + editedPhone
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
                            }else if( data.status === "pending" ){
                                return res.status( 200 )
                                          .json(
                                              {
                                                  error: true,
                                                  message: "invalid code"
                                              }
                                          );
                            }
                        }
                     );
    }catch( err ){
      console.log( err );
      if( err.status === 404 ){
        PhoneOtpVerification.deleteMany(
                              {
                                userId: _id,
                              }
                            ).then(
                              (_) => {
                                return res.status( 400 )
                                          .json(
                                            {
                                              error: true,
                                              message: "Code Expired"
                                            }
                                          );
                              }
                            ).catch(
                              ( error ) => {
                                return res.status( 500 )
                                          .json(
                                            {
                                              error: true,
                                              message: "Internal Server Error"
                                            }
                                          );
                              }
                            );
      }

    }
}

  export { sendOTPVerificationSMS, verifyOTPVerificationSMS };