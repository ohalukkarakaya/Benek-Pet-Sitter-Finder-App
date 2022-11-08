import express from "express";
import User from "../../models/User.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import generateTokens from "../../utils/generateTokens.js";
import UserOTPVerification from "../../models/UserOtpVerification.js";
import sendOTPVerificationEmail from "../../utils/sendValidationEmail.js";
import { signUpBodyValidation } from "../../utils/validationSchema.js";

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
  
      const user = await User.findOne(
        {
          email: req.body.email
        }
      );
      if(user)
        return res.status(400).json(
          {
            error: true,
            message: "User Allready Exists"
          }
        );
  
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.password, salt);
  
      await new User(
        {
          ...req.body,
          password: hashPassword
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
      async (req, res) => {
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
                const { accessToken, refreshToken } = await generateTokens(user);
                res.status(200).json(
                  {
                      error: false,
                      isEmailVerified: user.isEmailVerified,
                      accessToken,
                      refreshToken,
                      message: "Logged In Successfully"
                  }
                );
              }
            }
        }catch(err){
          console.log(err);
          res.status(500).json(
              {
                  error: true,
                  message: err.message
              }
          );
        }
      }
  );

  // Verify OTP
  router.post("/verifyOTP", async (req, res) => {
    try{
      let { userId, otp } = req.body;
      if(!userId || !otp){
        req.status(400).json(
          {
            error: true,
            message: "Empty otp details are not allowed"
          }
        );
      }else{
        const UserOTPVerificationRecords = await UserOTPVerification.find({
          userId,
        });
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
      }
    }catch(err){
      res.status(500).json(
        {
          error: true,
          message: "Internal server error"
        }
      );
    }
  });

  // Resend OTP Code
  router.post("/resendOtp", async (req, res) => {
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
          res
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
  });

export default router;
