import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs";

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
        privateKey: fs.readFileSync(process.env.DKIM_PRIVATE_KEY_FILE_PATH, "utf8"),
        // cacheDir: '/tmp',
        // cacheTreshold: 2048,
      },
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
      }
    }
  );

 //send OTP verification
 const sendOneTimePassword = async ( 
  {
    newPassword, 
    email
  }, 
  res, 
  next 
) => {
    try {
      const htmlEmail = sendEmailHelper( "tempPassWord", otp, null, null, null, null, null );

      //mail options
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Benek Geçici Şifreniz",
        html: htmlEmail,
      };
      await transporter.sendMail( mailOptions );
      
      next();
    }catch( e ){
      console.log( "ERROR: sendOneTimePassword - ", e );
      if( res ){
        return res.status( 500 )
                  .json(
                    {
                      error: true,
                      message: e.message,
                    }
                  );
      }
    }
  }

  export default sendOneTimePassword;