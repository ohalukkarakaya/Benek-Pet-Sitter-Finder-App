import CareGive from "../../models/CareGive/CareGive.js";
import User from "../../models/User.js";
import Pet from "../../models/Pet.js";

import sendNotification from "../../utils/notification/sendNotification.js";
import vatanSmsApiRequest from "../../utils/vatan_sms/vatanSmsApiRequest.js";
import vatanSmsBalanceQueryApiRequest from "../../utils/vatan_sms/vatanSmsBalanceQueryApiRequest.js";
import sendEmailHelper from "../userRoutesControllers/userControllers/passwordEmailHelper.js"; 

import twilio from "twilio";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import ttmobilSmsApiRequest from "../../utils/ttmobil_sms/ttmobilSmsApiRequest.js";

dotenv.config();

const emergencyController = async (req, res) => {
    try{
        const careGiveId = req.params.careGiveId.toString();
        const emergencyMessage = req.body.emergencyMessage;
        if(! careGiveId || !emergencyMessage ){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "Missing params"
                            }
                       );
        }

        const careGive = await CareGive.findById( careGiveId );
        if( !careGive ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "care give not found"
                            }
                       );
        }

        if(  
            req.user._id.toString() !== careGive.careGiver.careGiverId.toString() 
            // || careGive.finishProcess.isFinished
        ){
            return res.status( 401 )
                      .json(
                            {
                                error: true,
                                message: "You are not authorized for this"
                            }
                        );
        }

        const careGiver = await User.findById( careGive.careGiver.careGiverId.toString() );
        if(
            !careGiver 
            || careGiver.deactivation.isDeactive
        ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "care giver not found"
                            }
                       );
        }

        const petOwner = await User.findById( careGive.careGiver.careGiverId.toString() );
        if(
            !petOwner 
            || petOwner.deactivation.isDeactive
        ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "Pet owner not found"
                            }
                       );
        }

        const pet = await Pet.findById( careGive.petId.toString() );
        if( !pet ){
            return res.status( 404 )
                      .json(
                        {
                            error: true,
                            message: "Pet not found"
                        }
                      );
        }

        let petOwnerPhone = careGive.petOwner.petOwnerContact.petOwnerPhone;
        if( !careGive.petOwner.petOwnerContact.petOwnerPhone ){
            petOwnerPhone = petOwner.phone;
        }

        let petOwnerEmail = careGive.petOwner.petOwnerContact.petOwnerEmail;

        if( !careGive.petOwner.petOwnerContact.petOwnerEmail ){
            petOwnerEmail = petOwner.email;
        }

        if(
            !petOwnerPhone 
            && !petOwnerEmail
        ){
            return res.status( 404 )
                      .json(
                        {
                            error: true,
                            message: "Pet owners contact data not found"
                        }
                      );
        }

        if( petOwnerPhone ){

            let isTurkishNumber = false;
            if( petOwnerPhone.includes( "+9" ) ){
                isTurkishNumber = true;
            }

            if( isTurkishNumber ){
                petOwnerPhone = petOwnerPhone.replaceAll( "+", "" );
            }else{
                petOwnerPhone = petOwnerPhone.replaceAll( "+", "00" );
            }

            const to = petOwnerPhone;
            const body = `"${emergencyMessage}". Bu mesaj, bakıcınız: ${careGiver.identity.firstName} ${careGiver.identity.lastName} tarafından, evcil hayvanınız: ${pet.name} hakkında gönderilmiş bir acil durum mesajıdır. Lütfen belirtilen iletişim bilgilerinden, derhal bakıcınızla iletişime geçiniz. TelNo: ${careGiver.phone}, Email: ${careGiver.email}`;

            let smsRequest = await ttmobilSmsApiRequest(
                body,
                to,
                "Normal",
                "Tr",
                true
            );

            if(
                !smsRequest
                || !( smsRequest.serverStatus )
                || smsRequest.serverStatus !== 1
                || smsRequest.error
            ){
                console.log( "ERROR: vatanSmsSendValidationOtp - ", smsRequest.message );
                return res.status( 500 )
                          .json(
                            {
                                error: true,
                                message: "Internal Server Error"
                            }
                          );
            }
        }

        if( petOwnerEmail ){
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

              const htmlEmail = sendEmailHelper( "emergency", null, `${careGiver.identity.firstName} ${careGiver.identity.lastName}`, pet.name, careGiver.phone, careGiver.email, emergencyMessage );

              //mail options
              const mailOptions = {
                from: process.env.AUTH_EMAIL,
                to: petOwnerEmail,
                subject: `${pet.name} Hakkında Acil Bir Durum Oluştu!`,
                html: htmlEmail,
              };

              await transporter.sendMail( mailOptions );
        }

        await sendNotification(
            req.user._id.toString(),
            careGive.petOwner.petOwnerId.toString(),
            "emergency",
            careGiveId.toString(),
            null,
            null,
            null,
            null,
            null,
            null
        );

        return res.status( 200 )
                  .json(
                        {
                            error: false,
                            message: "Emergancy message succesfully send to pet owner"
                        }
                   );
    }catch( err ){
        console.log( err );
        res.status( 500 )
           .json(
                {
                    error: true,
                    message: "Internal Server Error"
                }
            );
    }
}

export default emergencyController;