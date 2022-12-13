import dotenv from "dotenv";
import twilio from "twilio";
import PhoneOtpVerification from "../models/UserSettings/PhoneOTPVerification.js";
import User from "../models/User.js";

dotenv.config();

const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

 //send OTP verification
 const sendOTPVerificationSMS = async ({_id, phone}, res, next) => {
    try {
        await twilioClient.verify
                    .services(process.env.TWILIO_SERVICE_ID)
                    .verifications
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
 const verifyOTPVerificationSMS = async ({_id, phone, otp}, res, next) => {
    try {
        await twilioClient.verify
                    .services(process.env.TWILIO_SERVICE_ID)
                    .verificationChecks
                    .create(
                        {
                            to: `+${phone}`,
                            code: otp
                        }
                    ).then(
                        (data) => {
                            if(data.status === "approved"){
                                // console.log(data);
                                User.findByIdAndUpdate(
                                    _id,
                                    {
                                        phone: `+${phone}`,
                                        isPhoneVerified: true
                                    }
                                ).then(
                                    (user) => {
                                        PhoneOtpVerification.deleteOne().then(
                                            (_) => {
                                              return res.status(200).json(
                                                {
                                                  error: false,
                                                  message: "phone verified succesfully",
                                                  phoneNumber: user.phone
                                                }
                                              );
                                            }
                                          ).catch(
                                            (error) => {
                                              console.log(error);
                                              return res.status(500).json(
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
                                    (e) => {
                                        console.log(e);
                                        return res.status(500).json(
                                            {
                                              error: true,
                                              message: "An error occured while saving",
                                              error: e
                                            }
                                          );
                                    }
                                );
                            }else if(data.status === "pending"){
                                return res.status(200).json(
                                    {
                                        error: true,
                                        message: "invalid code"
                                    }
                                );
                            }
                        }
                    );
    }catch(err){
      console.log(err);
    }
  }

  export { sendOTPVerificationSMS, verifyOTPVerificationSMS };