import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";
import CareGive from "../../../models/CareGive/CareGive.js";

import dotenv from "dotenv";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { QRCodeStyling } from "qr-code-styling-node/lib/qr-code-styling.common.js"
import nodeCanvas from "canvas";
import { JSDOM } from "jsdom";

dotenv.config();

const startCareGiveController = async (req, res) => {
    try{
        const careGiveId = req.params.careGiveId;
        const actionCodePassword = req.body.actionCodePassword;
        const petOwnerIdFromCode = req.body.petOwnerIdFromCode;
        const petIdFromCode = req.body.petIdFromCode;
        const careGiverIdFromCode = req.body.careGiverIdFromCode;
        const codeType = req.body.codeType;
        const userId = req.user._id.toString();

        if(
            !careGiveId
            || !actionCodePassword
            || !petOwnerIdFromCode
            || !petIdFromCode
            || !careGiverIdFromCode
            || !codeType
        ){
            return res.status( 400 ).json({ error: true, message: "missing params" });
        }

        if( codeType !== "Start" && codeType !== "start" ){
            return res.status( 400 ).json({ error: true, message: "This is not a start code" } );
        }

        const careGive = await CareGive.findById( careGiveId );
        if( !careGive ){
            return res.status( 404 ).json({ error: true, message: "Care give not found" });
        }
        if( userId !== careGive.careGiver.careGiverId.toString() ){
            return res.status( 400 ).json({ error: true, message: "care giver should scan this code" });
        }

        const pet = await Pet.findById( careGive.petId.toString() );
        if( !pet ){
            return res.status( 404 ).json({ error: true, message: "Pet not found" });
        }

        const careGiver = await User.findById( userId );
        if(
            !careGiver 
            || careGiver.deactivation.isDeactive
            || careGiver.blockedUsers.includes( careGive.petOwner.petOwnerId.toString() )
        ){
            return res.status( 404 ).json({ error: true, message: "Care giver not found" });
        }

        const petOwner = await User.findById( careGive.petOwner.petOwnerId.toString() );
        if(
            !petOwner
            || petOwner.deactivation.isDeactive
            || petOwner.blockedUsers.includes( userId )
        ){
            return res.status( 404 ).json({ error: true, message: "pet owner not found" });
        }

        if(
            pet._id.toString() !== petIdFromCode
            || userId !== careGiverIdFromCode
            || petOwner._id.toString() !== petOwnerIdFromCode
        ){
            return res.status( 400 ).json({ error: true, message: "data in code is invalid" });
        }

        // İlk tarihi ayrıştır
        var startDate = new Date(careGive.startDate);
        var startDay = startDate.getDate();
        var startMonth = startDate.getMonth();
        var startYear = startDate.getFullYear();
        var processedStartDate = new Date( startYear, startMonth, startDay );

        // Şu anki tarihi ayrıştır
        var now = new Date();
        var nowDay = now.getDate();
        var nowMonth = now.getMonth();
        var nowYear = now.getFullYear();
        var nowDate = new Date( nowYear, nowMonth, nowDay );

        if(
            processedStartDate > nowDate
            || processedStartDate < nowDate
        ){
            return res.status( 400 ).json({ error: true, message: "care give was past" });
        }

        const verifiedPassword = await bcrypt.compare( actionCodePassword, careGive.invitation.actionCode.codePassword );
        if( !verifiedPassword ){
            return res.status( 403 ).json({ error: true,  message: "Invalid password" });
        }

        //generate password
        const randPassword = crypto.randomBytes( 10 ).toString( 'hex' );
        const salt = await bcrypt.genSalt( Number( process.env.SALT ) );
        const hashCodePassword = await bcrypt.hash( randPassword, salt );

        //qr code data
        const data = {
            careGiveId: careGive._id.toString(),
            petOwner: careGive.petOwner.petOwnerId.toString(),
            careGiver: careGive.careGiver.careGiverId.toString(),
            pet: careGive.petId.toString(),
            codeType: "Finish",
            codePassword: randPassword,
        }

        let qrCodeData = JSON.stringify( data );

        const options = {
            width: 300,
            height: 300,
            data: qrCodeData,
            image: path.resolve( './src/benek_amblem.png' ),
            dotsOptions: {
                type: "dots"
            },
        };

        const qrCodeSvgWithBlobImage = new QRCodeStyling({ 
            jsdom: JSDOM, // this is required
            nodeCanvas, // this is required
            type: "svg",
            ...options,
            imageOptions: {
                saveAsBlob: true,
                crossOrigin: "anonymous",
                margin: 0
            },
            backgroundOptions: { color: 'rgba(255, 255, 255, 0)' },
            cornersSquareOptions: { type: 'dot' },
            cornersDotOptions: { type: 'extra-rounded' }
        });

        qrCodeSvgWithBlobImage.getRawData( "svg" ).then(async (url) => {
            careGive.invitation.actionCode.codeType = "Finish";
            careGive.invitation.actionCode.codePassword = hashCodePassword;
            careGive.invitation.actionCode.code = url;
            careGive.markModified( "invitation" );

            careGive.isStarted = true;
            careGive.markModified( "isStarted" );

            careGive.save().then(
                ( carGiveObject ) => {
                    return res.status( 200 )
                                .json({
                                    error: false,
                                    message: "care give started succesfully",
                                    finishCode: url
                                });
                }
            ).catch(
                ( er ) => {
                    console.log( er );
                    return res.status( 500 )
                              .json({
                                error: true,
                                message: "Internal server error"
                              });
                }
            );
        });
    }catch( err ){
        console.log( "Error: start care give - ", err );
        return res.status( 500 )
                  .json({
                     error: true,
                     message: "Internal server error"
                   });
    }
}

export default startCareGiveController;