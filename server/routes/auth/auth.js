import express from "express";

import User from "../../models/User.js";
import UserOTPVerification from "../../models/UserOtpVerification.js";
import UserToken from "../../models/UserToken.js";
import DeletedUserRefund from "../../models/DeletedUserRefund/DeletedUserRefund.js";

import sendOTPVerificationEmail from "../../utils/sendValidationEmail.js";
import { signUpBodyValidation } from "../../utils/bodyValidation/user/signUpValidationSchema.js";
import generateTokens from "../../utils/bodyValidation/user/generateTokens.js";

import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
//SignUp
router.post(
  "/signUp", 
  async (req, res) => {
    try{
      const { error } = signUpBodyValidation(req.body);
      if(error)
        return res.status(400).json(
          {
            error: true,
            message: error.details[0].message
          }
        );
  
      const user = await User.findOne({ email: req.body.email });
      if(user)
        return res.status(400).json(
          {
            error: true,
            message: "User Allready Exists"
          }
        );

      var refundCredit = 0;
      let refundCreditPriceType;
      const pastRefund = await DeletedUserRefund.find({ email: req.body.email });
      if(pastRefund){
        await Promise.all(
          pastRefund.map(
            (refund) => {
              refundCredit = refundCredit + refund.refundPrice.price;
              refundCreditPriceType = refund.refundPrice.priceType;
              refund.deleteOne().save(
                function (err) {
                  if(err) {
                      console.error('ERROR: While Update!');
                  }
                }
              );
            }
          )
        );
      }
  
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.password, salt);
  
      await new User(
        {
          userName: req.body.userName,
          email: req.body.email,
          identity: req.body.identity,
          location: req.body.location,
          password: hashPassword,
          trustedIps: [req.body.ip],
          refundCredit: {
            priceType: refundCreditPriceType,
            credit: refundCredit
          }
        }
      ).save().then(
        (result) => {
          // Handle account verification
          // Send verification code
          sendOTPVerificationEmail(
            {
              _id: result._id,
              email: result.email
            },
            res
          );
        }
      );
  
      }catch(err){
        console.log(err);
        res.status(500).json(
          {
            error: true,
            message: "Internal Server Error"
          }
        );
      }
    }
  );
  
//LogIn
router.post(
  "/login",
  async (req, res, next) => {
    try{
      const user = await User.findOne(
        {
          email: req.body.email
        }
      );
      if(!user){
        return res.status(401).json(
          {
            error: true,
            message: "Invalid email or password"
          }
        );
      }else{
        const userToken = await UserToken.findOne(
          {
            userId: user._id
          }
        );
        if(userToken){
          await userToken.remove();
        }
        const verifiedPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if(!verifiedPassword){
          return res.status(401).json(
            {
              error: true,
              message: "Invalid email or password"
            }
          );
        }else{
          if(!user.isEmailVerified){
            await UserOTPVerification.deleteMany({ userId: user._id });
            await sendOTPVerificationEmail(
              {
                _id: user._id,
                email: user.email,
              },
              null,
              next
            );
            return res.status(401).json(
              {
                error: true,
                message: "Email verification is required please check your inbox"
              }
            );
          }else{
            if(!user.trustedIps.includes(req.body.ip) || !user.isLoggedInIpTrusted){
              await UserOTPVerification.deleteMany({ userId: user._id });
              await User.updateOne({_id: user._id}, {isLoggedInIpTrusted: false});
              await sendOTPVerificationEmail(
                {
                  _id: user._id,
                  email: user.email,
                },
                null,
                next
              );
              return res.status(401).json(
                {
                  error: true,
                  message: "Ip is not trusted, therefore verification code send to your email"
                }
              );
            }else{
              if(user.deactivation.isDeactive){
                user.deactivation.isDeactive = false;
                user.deactivation.deactivationDate = null;
                user.isAboutToDelete = false;
                user.deactivation.markModified("deactivation");
                user.save(
                  function (err) {
                    if(err) {
                        console.error('ERROR: While Update!');
                    }
                  }
                );
              }
              const { accessToken, refreshToken } = await generateTokens(user);
              return res.status(200).json(
                {
                  error: false,
                  isLoggedInIpTrusted: user.isLoggedInIpTrusted,
                  isEmailVerified: user.isEmailVerified,
                  accessToken,
                  refreshToken,
                  message: "Logged In Successfully"
                }
              );
            }
          }
        }
      }
    }catch(err){
      console.log(err);
      return res.status(500).json(
        {
          error: true,
          message: err.message
        }
      );
    }
  }
);

// Verify OTP
router.post(
  "/verifyOTP",
  async (req, res) => {
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
);

// Resend OTP Code
router.post(
  "/resendOtp",
  async (req, res) => {
    try{
      let { userId, email } = req.body;
      if(!userId || !email){
        res.status(400).json(
          {
            error: true,
            message: "Empty otp details are not allowed"
          }
        );
      }else{
        //delete existing records and re send
        await UserOTPVerification.deleteMany({ userId });
        sendOTPVerificationEmail(
          {
            _id: userId,
            email
          },
          null,
          next
        );
      }
    }catch(err){
      res.status(500).json(
        {
          error: true,
          message: err.message
        }
      );
    }
  }
);

export default router;
