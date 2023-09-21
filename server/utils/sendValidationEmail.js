import bcrypt from "bcrypt";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs";
import UserOTPVerification from "../models/UserOtpVerification.js";
import sendEmailHelper from "../controllers/userRoutesControllers/userControllers/passwordEmailHelper.js";

dotenv.config();

let transporter = nodemailer.createTransport(
    {
      host: process.env.AUTH_EMAIL_HOST,
      port: process.env.AUTH_EMAIL_PORT,
      secure: true,
      dkim: {
        domainName: process.env.DKIM_DOMAIN,
        keySelector: process.env.DKIM_SELECTOR,
        privateKey: fs.readFileSync(
                              process.env.DKIM_PRIVATE_KEY_FILE_PATH, 
                              "utf8"
                      ),
        cacheDir: '/tmp',
        cacheTreshold: 2048,
      },
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
      }
    }
);

 //send OTP verification
 const sendOTPVerificationEmail = async (
  {
    _id, 
    email
  }, 
  res, 
  next
) => {
    try {
      const otp = `${
                      Math.floor(
                              100000 
                              + Math.random() 
                              * 900000
                           )
                   }`;

      const htmlEmail = sendEmailHelper( "otp", otp, null, null, null, null, null );

      //mail options
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: `Benek Signup Code: ${otp}`,
        html: htmlEmail,

      };

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

      const newOtpVerification = await new UserOTPVerification(
                                              {
                                                userId: _id,
                                                otp: hashedOtp,
                                              }
                                           );

      //save otp record
      await newOtpVerification.save();
      await transporter.sendMail( mailOptions );
      if( res !== null ){
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
      }else{
        next();
      }
    }catch( e ){

      res.status( 500 )
         .json(
            {
              error: true,
              message: e.message,
            }
          )
          
    }
  }

  export default sendOTPVerificationEmail;