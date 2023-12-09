import CareGive from "../models/CareGive/CareGive.js";
import ReportedMission from "../models/Report/ReportMission.js";
import PaymentData from "../models/PaymentData/PaymentData.js";
import AdminPaymentCancellation from "../models/Report/AdminPaymentCancellation.js";
import PunishmentRecord from "../models/Report/PunishmentRecord.js";

import deleteFileHelper from "../utils/fileHelpers/deleteFileHelper.js";

import mokaApprove3dPaymentRequest from "../utils/mokaPosRequests/mokaPayRequests/mokaApprove3dPaymentRequest.js";
import mokaVoid3dPaymentRequest from "../utils/mokaPosRequests/mokaPayRequests/mokaVoid3dPaymentRequest.js";
import invoiceDocumentGenerationHelper from "../utils/mokaPosRequests/mokaHelpers/invoiceDocumentGenerationHelper.js";
import sendPaymentCancellationEmailHelper from "../utils/mokaPosRequests/mokaHelpers/sendPaymentCancellationEmailHelper.js";

import dotenv from "dotenv";
import cron from "node-cron";

dotenv.config();

// - tested
const expireCareGive = cron.schedule(
    '0 0 0 * * *', // her gün gece 12:00
    // "* * * * *", // her dakika başı
    async () => {
        try{
            const now = new Date();

            const currentYear = now.getUTCFullYear();
            const currentMonth = now.getUTCMonth();
            const currentDate = now.getUTCDate();
            const currentHour = now.getUTCHours();
            const currentDateTime = new Date( currentYear, currentMonth, currentDate, currentHour, 0, 0, 0 );
            const oneWeekAgo = currentDateTime.setDate( now.getDate() - 7 );
            
            const expiredCareGives = await CareGive.find({ $and: [ { "finishProcess.isFinished": true }, { "finishProcess.finishDate": { $lte: oneWeekAgo } }]});

            if( expiredCareGives.length > 0 ){
                for( let careGive of expiredCareGives ){

                    const isCareGiveReported = await ReportedMission.find({ careGiveId: careGive._id.toString() } );
                    const adminPaymentCancellationForCareGive = await AdminPaymentCancellation.find({ releatedContentId: careGive._id.toString() });

                    if( !isCareGiveReported || isCareGiveReported.length <= 0 ){
                        //delete assets of event
                        const deleteAssets = await deleteFileHelper( `CareGive/${ careGive._id.toString() }` );
                        if( deleteAssets.error ){ console.log( `ERROR: delete assets - ${ careGive._id.toString() }` ); }

                        const paymentsToApprove = await PaymentData.find({ parentContentId: careGive._id.toString(), isPaid: true });
                        let paymentDataList = paymentsToApprove.toObject();

                        let connectedExpenseDocumentIdiesList = [];

                        let isPaymentCancelled = false;
                        let punishingAdminId;
                        let cancellationInfo;

                        if( paymentsToApprove && paymentsToApprove.length > 0 ){
                            for( let payment of paymentsToApprove ){
                                const adminPaymentCancellation = await AdminPaymentCancellation.find({ paymentVirtualPosId: payment.virtualPosOrderId });
                                if( adminPaymentCancellationForCareGive || adminPaymentCancellation ){
                                    //cancel payment
                                    const cancelPayment = await mokaVoid3dPaymentRequest( payment.virtualPosOrderId );
                                    if( 
                                        !cancelPayment 
                                        || (  
                                            cancelPayment.serverStatus && cancelPayment.serverStatus !== 0 && cancelPayment.serverStatus !== 1
                                            && ( cancelPayment.error === true || !( cancelPayment.data ) )
                                        )
                                    ){ 
                                        console.log( `ERROR: Cancel Payment - ${ payment._id.toString() } -`, cancelPayment.message ); 
                                    }
                                    //prepare states
                                    isPaymentCancelled = true;
                                    if( adminPaymentCancellationForCareGive ){
                                        punishingAdminId = adminPaymentCancellationForCareGive.adminId.toString();
                                        cancellationInfo = adminPaymentCancellationForCareGive.adminDesc;
                                    }else{
                                        punishingAdminId = adminPaymentCancellation.adminId.toString();
                                        cancellationInfo = adminPaymentCancellation.adminDesc;
                                    }
                                }else{
                                    //approve payment
                                    const approvePayment = await mokaApprove3dPaymentRequest( payment.subSellerGuid, payment.virtualPosOrderId, null );
                                    if( !approvePayment || approvePayment.error === true ){ 
                                        console.log( `ERROR: Approve Payment - ${ payment._id.toString() } -`, approvePayment.message ); 
                                    }
                                    connectedExpenseDocumentIdiesList.push( approvePayment.data.expenseRecordId );
                                }

                                await payment.deleteOne();
                            }
                            
                            if( isPaymentCancelled ){
                                // insert punishment
                                const newPunishment = {
                                    adminId: punishingAdminId,
                                    adminDesc: cancellationInfo
                                }
                                const pastPunishmentRecord = await PunishmentRecord.findOne({ userId: careGive.careGiver.careGiverId.toString() });
                                if( pastPunishmentRecord ){
                                    //if user already have a punishment record
                                    pastPunishmentRecord.punishmentList.push( newPunishment );
                                }else{
                                    //create new punishment
                                    await new PunishmentRecord({ userId: careGive.careGiver.careGiverId.toString(), punishmentList: [ newPunishment ] }).save();
                                }

                                //send cancellation email
                                await sendPaymentCancellationEmailHelper( careGive.petOwner.petOwnerContact.petOwnerEmail, careGive.careGiver.careGiverContact.careGiverEmail ); 
                            }else{
                                // send invoice paper to customer
                                await invoiceDocumentGenerationHelper( careGive.petOwner.petOwnerId, connectedExpenseDocumentIdiesList, paymentDataList, null ); 
                            }
                        }

                        //delete CareGive
                        await careGive.deleteOne();
                    }
                }
            }
        }catch( err ){
            console.log( err );
        }
    }
);

export default expireCareGive;