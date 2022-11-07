import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import generateTokens from "../utils/generateTokens.js";
import UserOTPVerification from "../models/UserOtpVerification.js";
import { loginBodyValidation, signUpBodyValidation } from "../utils/validationSchema.js";

dotenv.config();

const router = express.Router();

let transporter = nodemailer.createTransport(
  {
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    }
  }
);

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
          const { error } = loginBodyValidation(req.body);
          if(error)
            res.status(400).json(
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
          if(!user)
              return res.status(401).json(
                  {
                      error: true,
                      message: "Invalid email or password"
                  }
              );
          const verifiedPassword = await bcrypt.compare(
              req.body.password,
              user.password
          );
          if(!verifiedPassword)
              return res.status(401).json(
                  {
                      error: true,
                      message: "Invalid email or password"
                  }
              );
  
          const { accessToken, refreshToken } = await generateTokens(user);
  
          res.status(200).json(
              {
                  error: false,
                  accessToken,
                  refreshToken,
                  message: "Logged In Successfully"
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

  // Verify OTP
  router.post("/verifyOTP", async (req, res) => {
    try{
      let { userId, otp } = req.body;
      if(!userId || !otp){
        throw Error("Empty otp details are not allowed");
      }else{
        const UserOTPVerificationRecords = await UserOTPVerification.find({
          userId,
        });
        if(UserOTPVerificationRecords.length <= 0){
          //no record found
          throw Error(
            "Account record doesn't exist or has been verified already"
          );
        }else{
          //user otp record exists
          const { expiresAt } = UserOTPVerificationRecords[0];
          const hashedOTP = UserOTPVerificationRecords[0].otp;

          if( expiresAt < Date.now()){
            //user Otp record has expired
            await UserOTPVerification.deleteMany({ userId });
            throw new Error("Code has expired. Please request again");
          }else{
            const validOTP = await bcrypt.compare(otp, hashedOTP);

            if(!validOTP){
             //supplied OTP is wrong
              throw Error("Invalid code passed. Check your inbox");
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

  //send OTP verification
  const sendOTPVerificationEmail = async ({_id, email}, res) => {
    try {
      const otp = `${Math.floor(1000 + Math.random() * 9000)}`

      //mail options
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify your email",
        html: `<p>Enter <b>${otp}</b> in the app to verify your email adress and complate the signup</p>
        <p>This code <b>expires in 1 hour</b></p>`,

      };

      //hesh the otp
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashedOtp = await bcrypt.hash(otp, salt);
      const newOtpVerification = await new UserOTPVerification({
        userId: _id,
        otp: hashedOtp,
      });

      //save otp record
      await newOtpVerification.save();
      await transporter.sendMail(mailOptions);
      res.json(
        {
          status: "PENDING",
          message: "Verification mail send to Email",
          data: {
            userId: _id,
            email,
          }
        }
      );
    }catch(e){
      res.status(500).json(
        {
          error: true,
          message: e.message,
        }
      )
    }
  }

export default router;
