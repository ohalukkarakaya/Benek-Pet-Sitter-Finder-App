import CareGive from "../../../../models/CareGive/CareGive.js";

import mokaCreatePaymentHelper from "../../../../utils/mokaPosRequests/mokaHelpers/mokaCreatePaymentHelper.js";
import prepareExtraMissionHelper from "../../../../utils/prepareExtraMissionHelper.js";

import dotenv from "dotenv";

dotenv.config();

const scheduleMissionController = async ( req, res) => {
    try{
        const careGiveId = req.params.careGiveId.toString();
        const missionDesc = req.body.missionDesc.toString();
        const missionDate = req.body.missionDate.toString();

        // Tarih ve saat bilgisini ayır
        var parts = missionDate.split('-');
        var datePart = parts[0]; // "xx.xx.xxxx"
        var timePart = parts[1]; // "x:xx"

        // Tarih kısmını daha fazla ayır ve Date nesnesi oluştur
        var dateParts = datePart.split('.');
        var day = parseInt(dateParts[0], 10); // Gün
        var month = parseInt(dateParts[1], 10) - 1; // Ay (Ocak 0'dan başlar, Eylül 8'dir)
        var year = parseInt(dateParts[2], 10); // Yıl

        // Saat ve dakikayı ayır
        var timeParts = timePart.split(':');
        var hours = parseInt(timeParts[0], 10); // Saat
        var minutes = parseInt(timeParts[1], 10); // Dakika

        // Date nesnesini oluştur
        const missionDateToUse = new Date( year, month, day, hours, minutes );

        if(
            !careGiveId 
            || !missionDesc 
            || !missionDate
        ){
            return res.status( 400 ).json({
                error: true,
                message: "Missing param"
            });
        }
        
        const careGive = await CareGive.findById( careGiveId );
        if( !careGive ){
            return res.status( 404 ).json({
                error: true,
                message: "Care give not found"
            });
        }
        const isVolunteer = careGive.prices.priceType === "Free";
        if( isVolunteer ){
            return res.status( 401 ).json({
                error: true,
                message: "You can't schedule mission for Free careGive"
            });
        }

        if(
            careGive.endDate < missionDateToUse
            || careGive.startDate > missionDateToUse
        ){
            return res.status( 400 ).json({
                error: true,
                message: "You can't insert mission on this date"
            });
        }

        const areThereMissionAtSameTime = careGive.missionCallender.find(
            missionObject =>
                missionObject.missionDate === missionDateToUse
        );
        if( areThereMissionAtSameTime ){
            return res.status( 400 ).json({
                error: true,
                message: "there is allready mission scheduled at this time"
            });
        }

        if( careGive.petOwner.petOwnerId.toString() !== req.user._id.toString() ){
            return res.status( 400 ).json({
                error: true,
                message: "You are not authorized to schedule mission for this pet"
            });
        }
        const isExtraMission = careGive.missionCallender.length >= careGive.prices.maxMissionCount;

        if( isExtraMission ){
            const cardGuid = req.body.cardGuid 
                ? req.body.cardGuid.toString()
                : null;

            const cardNo = req.body.cardNo.toString();
            const cvv = req.body.cvc.toString();
            const cardExpiryDate = req.body.cardExpiryDate.toString();
            const userId = req.user._id.toString();
            const price = parseFloat( careGive.prices.extraMissionPrice );

            const redirectUrl = process.env.BASE_URL + "/api/payment/redirect";

            const paymentData = await mokaCreatePaymentHelper(
                userId, //customer user id
                cardGuid, //card guid
                cardNo, //card number
                cardExpiryDate.split("/")[0], //card expiry month
                cardExpiryDate.split("/")[1], //card expiry year
                cvv, //card cvv
                careGive._id.toString(), //parent id
                missionDesc, // productDesc
                "ExtraMission", //payment type
                missionDate,
                careGive.careGiver.careGiverId, //caregiver id
                careGive.invitation.careGiverPosGuid, //caregiver guid
                price, // amount
                redirectUrl,
                req.body.recordCard === 'true',
                false // is from invitation
            );

            if( paymentData.message === 'Daily Limit Exceeded' ){
                return res.status( 500 ).json({
                    error: true,
                    message: "CareGiver Daily Limit Exceeded",
                    payError: paymentData
                });
            }

            if(
                !paymentData 
                || paymentData.error 
                || paymentData.serverStatus !== 1 
                || !paymentData.payData 
                || paymentData.payData === null 
                || paymentData.payData === undefined
            ){
                return res.status( 500 ).json({
                    error: true,
                    message: "Error While Payment",
                    payError: paymentData
                });
            }

            return res.status( 200 ).json({
                error: false,
                message: "Waiting for 3d payment approve",
                payData: paymentData.payData,
                careGive: careGiveId
            });
        }

        const scheduleExtraMission = await prepareExtraMissionHelper(
            careGiveId,
            isExtraMission,
            missionDesc,
            missionDate,
            null,
            null,
            null,
            careGive.invitation.careGiverPosGuid,
            null
        );

        if(
            !scheduleExtraMission
            || scheduleExtraMission.error
        ){
            return res.status( 500 ).json({
                error: true,
                message: "Internal Server Error"
            })
        }

        return res.status( 200 ).json({
            error: false,
            message: "Mission Scheduled Succesfully",
            payData: null,
            careGive: careGiveId
        });
    }catch( err ){
        console.log( "Error: schedule care give mission - ", err );
        return res.status( 500 ).json({
            error: true,
            message: "Internal server error"
        });
    }
}

export default scheduleMissionController;