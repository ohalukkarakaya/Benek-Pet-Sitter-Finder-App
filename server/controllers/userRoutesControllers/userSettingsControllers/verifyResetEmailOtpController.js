import User from "../../../models/User.js";
import ChangeEmailOTP from "../../../models/UserSettings/ChangeEmail.js";
import UserOtpVerification from "../../../models/UserOtpVerification.js";

import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const verifyResetEmailOtpController = async (req, res) => {
    try{
        const otp = req.body.otp;
        if( !otp ){
          req.status(400).json(
            {
              error: true,
              message: "Empty otp details are not allowed"
            }
          );
        }else{
          const ChangeEmailOTPVerificationRecords = await ChangeEmailOTP.find(
            {
              userId : req.user._id.toString()
            }
          );
          if(UserOTPVerificationRecords.length <= 0){
            //no record found
            req.status(404).json(
              {
                error: true,
                message: "Account record doesn't exist or has been verified already"
              }
            );
          }else{
            //user otp record exists
            const { expiresAt } = ChangeEmailOTPVerificationRecords[0];
            const hashedOTP = ChangeEmailOTPVerificationRecords[0].otp;
  
            if( expiresAt < Date.now()){
              //user Otp record has expired
              await ChangeEmailOTPVerificationRecords.deleteMany({ userId: req.user._id.toString() });
              res.status(405).json(
                {
                  error: true,
                  message: "Code has expired. Please request again"
                }
              );
            }else{
              const validOTP = await bcrypt.compare(otp, hashedOTP);
  
              if(!validOTP){
                //supplied OTP is wrong
                req.status(406).json(
                  {
                    error: true,
                    message: "Invalid code passed. Check your inbox"
                  }
                );
              }else{
                User.findOne(
                  { _id: req.user._id.toString() },
                  async (err, user) => {
                    if(err){
                      res.status(404).json(
                        {
                            error: true,
                            message: "User not found"
                        }
                      );
                    }else{
                      if(user.deactivation.isDeactive){
                        return res.status(404).json(
                          {
                            error: true,
                            message: "User not found"
                          }
                        );
                      }
                      //success
                      await user.updateOne(
                        {
                            _id: req.user._id.toString()
                        },
                        {
                            email: ChangeEmailOTPVerificationRecords[0].newEmail
                        }
                      );
                      await UserOtpVerification.deleteMany(
                        {
                            userId: req.user._id.toString()
                        }
                      );
                      res.status(200).json(
                        {
                          message: "Email updated succesfuly"
                        }
                      );
                    }
                  }
                );
              }
            }
          }
        }
    }catch(err){
        res.status(500).json(
          {
            error: true,
            message: "Internal server error"
          }
        );
    }
}

export default verifyResetEmailOtpController;