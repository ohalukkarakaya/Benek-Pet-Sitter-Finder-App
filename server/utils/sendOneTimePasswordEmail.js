import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs";

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
 const sendOneTimePassword = async ({newPassword, email}, res, next) => {
    try {

      //mail options
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "One Time Password",
        html: `<p>Use <b>${newPassword}</b> in the app as your new password.</p>
        <p>We forcely reccomend you to <b>set a new password as soon as possible</b> in the app</p>`,

      };
      await transporter.sendMail(mailOptions);
      
      next();
    }catch(e){
      res.status(500).json(
        {
          error: true,
          message: e.message,
        }
      )
    }
  }

  export default sendOneTimePassword;