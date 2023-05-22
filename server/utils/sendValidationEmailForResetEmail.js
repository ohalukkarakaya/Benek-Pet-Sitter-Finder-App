import bcrypt from "bcrypt";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs";
import ChangeEmailOTP from "../models/UserSettings/ChangeEmail.js";

dotenv.config();

let transporter = nodemailer.createTransport(
    {
      host: process.env
                   .AUTH_EMAIL_HOST,
      port: process.env
                   .AUTH_EMAIL_PORT,
      secure: true,
      dkim: {
        domainName: process.env
                           .DKIM_DOMAIN,
        keySelector: process.env
                            .DKIM_SELECTOR,
        privateKey: fs.readFileSync(
                              process.env
                                     .DKIM_PRIVATE_KEY_FILE_PATH, 
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
 const sendOTPVerificationEmailForResetEmail = async (
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

      //mail options
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify your email",
        html: `<p>Enter <b>${otp}</b> in the app to verify your email adress and complate the signup</p>
        <p>This code <b>expires in 1 hour</b></p>`,

      };

      await transporter.sendMail( mailOptions );

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

      await new ChangeEmailOTP(
                                {
                                  userId: _id.toString(),
                                  newEmail: email,
                                  otp: hashedOtp,
                                }
                ).save()
                 .then(
                  ( newOtpVerification ) => {
                    if( res !== null ){
                      return res.json(
                        {
                          status: "PENDING",
                          message: "Verification mail send to new email",
                          data: {
                            userId: _id,
                            email,
                          }
                        }
                      );
                    }else{
                      next();
                    }
                  }
                 ).catch(
                  ( error ) => {
                    console.log( "ERROR: sendOTPVerificationEmailForResetEmail - ", error );
                    return res.status( 500 )
                              .json(
                                {
                                  error: true,
                                  message: "Internal Server Error"
                                }
                              );
                  }
                 );
      
    }catch( e ){
      console.log( "ERROR: sendOTPVerificationEmailForResetEmail - ", e );
      res.status( 500 )
         .json(
            {
              error: true,
              message: "Internal Server Error",
            }
          )
    }
  }

  export default sendOTPVerificationEmailForResetEmail;