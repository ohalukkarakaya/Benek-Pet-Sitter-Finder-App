import CareGive from "../models/CareGive/CareGive.js";
import Pet from "../models/Pet.js";
import User from "../models/User.js";

import bcrypt from "bcrypt";
import crypto from "crypto";
import QRCode from "qrcode";
import dotenv from "dotenv";

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
            QRCode.toDataURL(
                ticketData, 
                async ( err, url ) => {
                    if ( err ) {
                        reject(
                            {
                                error: true,
                                serverStatus: -1,
                                message: "Internal server error"
                            }
                        );
                    } else {
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
                    }
                }
            );
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
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashTicketPassword = await bcrypt.hash(randPassword, salt);

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