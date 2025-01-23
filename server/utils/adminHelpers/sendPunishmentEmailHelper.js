import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import fs from 'fs';

// helpers
import careGiverPunishmentEmailHtmlHelper from "./careGiverPunishmentEmailHtmlHelper.js";

dotenv.config();

const sendPunishmentEmailHelper = async ( punishingUsersEmail, punishmentDesc ) => {
    try{
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

        const htmlEmail = careGiverPunishmentEmailHtmlHelper( punishmentDesc );

        const subject = `💥 Bir Yeni Ceza Puanı Aldınız!`;

        //mail options
        const mailOptions = {
          from: process.env.AUTH_EMAIL,
          to: punishingUsersEmail,
          subject: subject,
          html: htmlEmail,
        };

        await transporter.sendMail( mailOptions );

        return {
            error: false,
            statusCode: 200,
            message: "Succesful",
        }
    }catch( err ){
        console.log( "ERROR: sendPunishmentEmailHelper - ", err );
        return {
            error: true,
            statusCode: 500,
            message: "Internal Server Error"
        }
    }
}

export default sendPunishmentEmailHelper;