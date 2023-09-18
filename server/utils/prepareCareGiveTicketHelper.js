import CareGive from "../models/CareGive/CareGive.js";

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
    userId,
    careGiveId,
    petOwner,
    virtualPosOrderId,
    paymentDataId,
    orderUniqueCode,
) => {
    try{
        if( petOwner ){
            petOwner.save(
                ( err ) => {
                    if( err ){
                        console.log( err );
                    }
                }
            );
        }

        const randPassword = crypto.randomBytes( 10 ).toString( 'hex' );
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashTicketPassword = await bcrypt.hash(randPassword, salt);

        const careGive = await CareGive.findById( careGiveId );

        //qr code data
        const data = {
            careGiveId: careGiveId,
            petOwner: userId,
            careGiver: careGive.careGiver.careGiverId.toString(),
            pet: careGive.petId.toString(),
            codeType: "Start",
            codePassword: randPassword,
        }

        let qrCodeData = JSON.stringify( data );

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