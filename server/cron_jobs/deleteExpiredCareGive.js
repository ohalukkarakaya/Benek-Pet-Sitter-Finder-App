import CareGive from "../models/CareGive/CareGive.js";
import ReportedMission from "../models/Report/ReportMission.js";
import PaymentData from "../models/PaymentData/PaymentData.js";

import deleteFileHelper from "../utils/fileHelpers/deleteFileHelper.js";

import mokaApprove3dPaymentRequest from "../utils/mokaPosRequests/mokaPayRequests/mokaApprove3dPaymentRequest.js";
import invoiceDocumentGenerationHelper from "../utils/mokaPosRequests/mokaHelpers/invoiceDocumentGenerationHelper.js";

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

            const currentDateTime = new Date(
                currentYear, 
                currentMonth, 
                currentDate, 
                currentHour, 
                0, 0, 0
            );

            const oneWeekAgo = currentDateTime.setDate( now.getDate() - 7 );

            const expiredCareGives = await CareGive.find(
                {
                    $and: [
                        { "finishProcess.isFinished": true },
                        { 
                            "finishProcess.finishDate": {
                                $lte: oneWeekAgo
                            }
                        }
                    ]
                    
                }
            );

            if( expiredCareGives.length > 0 ){
                for(
                    let careGive
                    of expiredCareGives
                ){
                    const isCareGiveReported = await ReportedMission.find(
                        {
                            careGiveId: careGive._id.toString()
                        }
                    );

                    if( 
                        !isCareGiveReported
                        || isCareGiveReported.length <= 0
                    ){
                        //delete assets of event
                        const deleteAssets = await deleteFileHelper( `CareGive/${ careGive._id.toString() }` );
                        if( deleteAssets.error ){
                            return res.status( 500 )
                                    .json(
                                        {
                                            error: true,
                                            message: "Internal Server Error"
                                        }
                                    );
                        }

                        const paymentsToApprove = await PaymentData.find(
                            { 
                                parentContentId: careGive._id.toString(),
                                isPaid: true
                            }
                        );

                        let paymentDataList = paymentsToApprove.toObject();
                        let connectedExpenseDocumentIdiesList = [];
                        if(
                            paymentsToApprove
                            && paymentsToApprove.length > 0
                        ){
                            for(
                                let payment
                                of paymentsToApprove
                            ){
                                const approvePayment = await mokaApprove3dPaymentRequest( 
                                    payment.subSellerGuid,
                                    payment.virtualPosOrderId,
                                    res
                                );

                                if( 
                                    !approvePayment 
                                    || approvePayment.error === true 
                                ){
                                    console.log( `ERROR: Approve Payment - ${ payment._id.toString() } -`, approvePayment.message );
                                }

                                connectedExpenseDocumentIdiesList.push( approvePayment.data.expenseRecordId );

                                await payment.deleteOne();
                            }

                            // send invoice paper to customer
                            await invoiceDocumentGenerationHelper( careGive.petOwner.petOwnerId, connectedExpenseDocumentIdiesList, paymentDataList, null );
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