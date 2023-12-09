import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import fs from 'fs';

// helpers
import careGiverPaymentCancellationEmailHtmlHelper from "./careGiverPaymentCancellationEmailHtmlHelper.js";
import petOwnerPaymentCancellationEmailHtmlHelper from "./petOwnerPaymentCancellationEmailHtmlHelper.js";

dotenv.config();

const sendPaymentCancellationEmailHelper = async ( petOwnerEmail, careGiverEmail ) => {
    try{
        for( let i = 0; i <= 1; i ++ ){ // iki kere girsin diye ( bir bakıcı bir de evcil hayvan sahibi için )
          //send email
          let transporter = nodemailer.createTransport({
                host: process.env.AUTH_EMAIL_HOST,
                port: process.env.AUTH_EMAIL_PORT,
                secure: true,
                dkim: {
                  domainName: process.env.DKIM_DOMAIN,
                  keySelector: process.env.DKIM_SELECTOR,
                  privateKey: fs.readFileSync( process.env.DKIM_PRIVATE_KEY_FILE_PATH, "utf8" ),
                  cacheDir: '/tmp',
                  cacheTreshold: 2048,
                },
                auth: {
                  user: process.env.AUTH_EMAIL,
                  pass: process.env.AUTH_PASS,
                }
          });

          const htmlEmail = i === 0 
                              ? careGiverPaymentCancellationEmailHtmlHelper()
                              : petOwnerPaymentCancellationEmailHtmlHelper();

          const emailToSendEmail = i === 0
                                    ? careGiverEmail
                                    : petOwnerEmail;

          const subject = i === 0
                            ? `Hakkınızdaki Şikayeti Değerlendirdik`
                            : `Şikayetinizi Haklı Bulduk`;

          //mail options
          const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: emailToSendEmail,
            subject: subject,
            html: htmlEmail,
          };

          await transporter.sendMail( mailOptions );
        }

        return {
            error: false,
            statusCode: 200,
            message: "Succesful",
        }
    }catch( err ){
        console.log( "ERROR: sendPaymentCancellationEmailHelper - ", err );
        return {
            error: true,
            statusCode: 500,
            message: "Internal Server Error"
        }
    }
}

export default sendPaymentCancellationEmailHelper;