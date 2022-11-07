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
    host: "smtp-mail.outlook.com",
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
          sendOTPVerificationEmail(result, res);
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

      const hashedOtp = bcrypt.hash(otp, saltRounds);
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
          message: "Failed to send verification mail",
        }
      )
    }
  }

export default router;
