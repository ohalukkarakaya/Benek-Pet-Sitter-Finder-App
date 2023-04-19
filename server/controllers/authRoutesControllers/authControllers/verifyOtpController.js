import User from "../../../models/User.js";
import UserOTPVerification from "../../../models/UserOtpVerification.js";

import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const verifyOtpController = async (req, res) => {
    try{
      let { userId, otp, ip } = req.body;
      if(!userId || !otp || !ip){
        req.status(400).json(
          {
            error: true,
            message: "Empty otp details are not allowed"
          }
        );
      }else{
        const UserOTPVerificationRecords = await UserOTPVerification.find(
          {
            userId,
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
          const { expiresAt } = UserOTPVerificationRecords[0];
          const hashedOTP = UserOTPVerificationRecords[0].otp;

          if( expiresAt < Date.now()){
            //user Otp record has expired
            await UserOTPVerification.deleteMany({ userId });
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
              const user = User.findOne(
                {_id: userId},
                async (err, user) => {
                  if(err){
                    res.status(404).json(
                      {
                        error: true,
                        message: "User not found"
                      }
                    );
                  }else{
                    if(!user.trustedIps.includes(ip) && user.isLoggedInIpTrusted){
                      res.status(405).json(
                        {
                          error: true,
                          message: "Ip is not trusted. Please try to login from your device"
                        }
                      );
                    }else if(!user.trustedIps.includes(ip) && !user.isLoggedInIpTrusted && user.isEmailVerified){
                      await User.updateOne(
                        {_id: userId},
                        { $push: { trustedIps: ip }}
                      );
                      await User.updateOne({_id: userId}, {isLoggedInIpTrusted: true});
                      await UserOTPVerification.deleteMany({ userId });
                      res.status(200).json(
                        {
                           message: "Ip verified succesfuly"
                        }
                      );
                    }else{
                      //success
                      await User.updateOne({_id: userId}, {isEmailVerified: true});
                      await UserOTPVerification.deleteMany({ userId });
                      res.status(200).json(
                        {
                          message: "User email verified succesfuly"
                        }
                      );
                    }
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

export default verifyOtpController;