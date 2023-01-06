import express from "express";
import CareGive from "../../models/CareGive/CareGive.js";
import User from "../../models/User.js";
import Pet from "../../models/Pet.js";
import dotenv from "dotenv";
import auth from "../../middleware/auth.js";
import twilio from "twilio";
import nodemailer from "nodemailer";

dotenv.config();

const router = express.Router();

router.post(
    "/:careGiveId",
    auth,
    async() => {
        try{
            const careGiveId = req.params.careGiveId.toString();
            const emergencyMessage = req.body.emergencyMessage;
            if(!careGiveId || !emergencyMessage){
                return res.status(400).json(
                    {
                        error: true,
                        message: "Missing params"
                    }
                );
            }

            const careGive = await CareGive.findById(careGiveId);
            if(!careGive){
                return res.status(404).json(
                    {
                        error: true,
                        message: "care give not found"
                    }
                );
            }

            if(req.user._id.toString() !== careGive.careGiver.careGiverId.toString()){
                return res.status(401).json(
                    {
                        error: true,
                        message: "You are not authorized for this"
                    }
                );
            }

            const careGiver = await CareGiver.findById(careGive.careGiver.careGiverId.toString());
            if(!careGiver){
                return res.status(404).json(
                    {
                        error: true,
                        message: "care giver not found"
                    }
                );
            }

            const petOwner = await User.findById( careGive.careGiver.careGiverId.toString() );
            if(!petOwner){
                return res.status(404).json(
                    {
                        error: true,
                        message: "Pet owner not found"
                    }
                );
            }

            const pet = await Pet.findById(careGive.petId.toString());
            if(!pet){
                return res.status(404).json(
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

            if(!petOwnerPhone && !petOwnerEmail){
                return res.status(404).json(
                    {
                        error: true,
                        message: "Pet owners contact data not found"
                    }
                );
            }

            if(petOwnerPhone){
                const accountSid = process.env.TWILIO_ACCOUNT_SID;
                const authToken = process.env.TWILIO_AUTH_TOKEN;
                const client = new twilio(accountSid, authToken);

                const from = process.env.TWILIO_PHONE_NUMBER;
                const to = petOwnerPhone;
                const body = `"${emergencyMessage}". This is an emergency message from your care giver: ${careGiver.identity.firstName} ${careGiver.identity.lastName}, about your pet: ${pet.name}. Please contact with your care giver immediately with the specified contact information. Phone: ${careGiver.phone}, Email: ${careGiver.email}`;

                client.messages
                        .create({
                            body: body,
                            from: from,
                            to: to
                        })
                        .then(message => console.log(message.sid));

            }

            if(petOwnerEmail){
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

                  //mail options
                  const mailOptions = {
                    from: process.env.AUTH_EMAIL,
                    to: petOwnerEmail,
                    subject: "Emergency Message About ${pet.name}",
                    html: `<p><b>"${emergencyMessage}".</b></p>
                          <p>This is an emergency message from your care giver: ${careGiver.identity.firstName} ${careGiver.identity.lastName},</p>
                          <p>about your pet: ${pet.name}.</p>
                          <p>Please contact with your care giver immediately with the specified contact information.</p>
                          <p>Phone: <b>${careGiver.phone}</b>, Email: <b>${careGiver.email}</b></p>`,

                  };

                  await transporter.sendMail(mailOptions);
            }

            return res.status(200).json(
                {
                    error: false,
                    message: "Emergancy message succesfully send to pet owner"
                }
            );
        }catch(err){
            (error) => {
                console.log("ERROR: emergency", err);
                return res.status(500).json(
                    {
                        error: true,
                        message: "Internal server error"
                    }
                );
            }
        }
    }
);

export default router;