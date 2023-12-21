import CareGive from "../models/CareGive/CareGive.js";
import Pet from "../models/Pet.js";
import User from "../models/User.js";

import bcrypt from "bcrypt";
import crypto from "crypto";
import { QRCodeStyling } from "qr-code-styling-node/lib/qr-code-styling.common.js"
import nodeCanvas from "canvas";
import { JSDOM } from "jsdom";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

function generateQRCode( 
    ticketData,
    hashCodePassword,
    virtualPosOrderId,
    paymentDataId,
    orderUniqueCode,
    careGive 
){
    return new Promise(
        ( resolve, reject ) => {
            const options = {
                width: 300,
                height: 300,
                data: ticketData,
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
                careGive.invitation.actionCode.codeType = "Start";
                careGive.invitation.actionCode.codePassword = hashCodePassword;
                careGive.invitation.actionCode.code = url;
                careGive.invitation.isAccepted = true;
                careGive.markModified("invitation");

                careGive.prices.orderInfo = {
                    paymentId: paymentDataId,
                    orderId: virtualPosOrderId,
                    orderUniqueCode: orderUniqueCode
                }
                careGive.markModified("prices");
                const careGiveToSend = await careGive.save();
                resolve( careGiveToSend );
            });
        }
    );
}


const prepareCareGiveTicketHelper = async (
    careGiveId,
    virtualPosOrderId,
    paymentDataId,
    orderUniqueCode,
) => {
    try{
        const randPassword = crypto.randomBytes( 10 ).toString( 'hex' );
        const salt = await bcrypt.genSalt( Number( process.env.SALT ) );
        const hashTicketPassword = await bcrypt.hash( randPassword, salt );

        const careGive = await CareGive.findById( careGiveId );

        const careGiveHistoryRecordforPet = {
            careGiver: careGive.careGiver.careGiverId,
            startDate: careGive.startDate,
            endDate: careGive.endDate,
            price:`${ careGive.prices.servicePrice } ${ careGive.prices.priceType }`
        }

        const careGiveHistoryRecordforCareGiver = {
            pet: careGive.petId,
            startDate: careGive.startDate,
            endDate: careGive.endDate,
            price: `${ careGive.prices.servicePrice } ${ careGive.prices.priceType }`
        }

        const careGiveHistoryRecordforPetOwner = {
            pet: careGive.petId,
            careGiver: careGive.careGiver.careGiverId,
            startDate: careGive.startDate,
            endDate: careGive.endDate,
            price: `${ careGive.prices.servicePrice } ${ careGive.prices.priceType }`
        }

        const pet = await Pet.findById( careGive.petId );
        if( !pet ){
            return {
                error: true,
                serverStatus: -1,
                message: "Pet Not Found"
            };
        }
        pet.careGiverHistory
           .push( 
                careGiveHistoryRecordforPet 
            );

        pet.markModified( "careGiverHistory" );

        const careGiver = await User.findById( careGive.careGiver.careGiverId );
        if( !careGiver ){
            return {
                error: true,
                serverStatus: -1,
                message: "CareGiver Not Found"
            };
        }

        careGiver.caregiverCareer
                    .push(
                        careGiveHistoryRecordforCareGiver
                    );

        careGiver.markModified( "caregiverCareer" );

        const petOwner = await User.findById( careGive.petOwner.petOwnerId );
        if( !petOwner ){
            return {
                error: true,
                serverStatus: -1,
                message: "petOwner Not Found"
            };
        }

        careGive.petOwner
                .petOwnerContact
                .petOwnerEmail = petOwner.email;

        careGive.petOwner
                .petOwnerContact
                .petOwnerPhone = petOwner.phone;

        careGive.markModified( "petOwner" );

        petOwner.pastCaregivers
                .push(
                    careGiveHistoryRecordforPetOwner
                );
        petOwner.markModified( "pastCaregivers" );

        //qr code data
        const data = {
            careGiveId: careGiveId,
            petOwner: petOwner._id.toString(),
            careGiver: careGiver._id.toString(),
            pet: pet._id.toString(),
            codeType: "Start",
            codePassword: randPassword,
        }

        let qrCodeData = JSON.stringify( data );



        await careGiver.save(
            ( err ) => {
                if( err ){
                    console.log( err );
                }
            }
        )

        await pet.save(
            ( err ) => {
                if( err ){
                    console.log( err );
                }
            }
        );

        await petOwner.save(
            ( err ) => {
                if( err ){
                    console.log( err );
                }
            }
        );

        const careGiveToSend = await generateQRCode( 
            qrCodeData, 
            hashTicketPassword, 
            virtualPosOrderId,
            paymentDataId,
            orderUniqueCode,
            careGive 
        );

        if( careGiveToSend ){
            return {
                error: false,
                serverStatus: 1,
                message: `You accepted careGive successfully`,
                payData: null,
                codeType: careGiveToSend.invitation.actionCode.codeType,
                url: careGiveToSend.invitation.actionCode.code,
                ticketId: careGiveId
            };
        }

    }catch( err ){
        console.log( "ERROR: prepareCareGiveTicketHelper - ", err );
        return {
            error: true,
            serverStatus: -1,
            message: "Internal Server Error"
        };
    }
};

export default prepareCareGiveTicketHelper;