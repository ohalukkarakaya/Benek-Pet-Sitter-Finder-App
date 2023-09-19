import CareGive from "../models/CareGive/CareGive.js";

import sendNotification from "./notification/sendNotification.js";

const prepareExtraMissionHelper = async (
    careGiveId,
    isExtraMission,
    missionDesc,
    sendedMissionDate,
    paymentDataId,
    orderUniqueCode,
    sanalPosIslemId,
    subSellerGuid,
    priceData
) => {
    try{
        const careGive = await CareGive.findById( careGiveId );
        if( !careGive ){
            return {
                error: true,
                serverStatus: -1,
                message: "CareGive Not Found"
            };
        }

        // Tarih ve saat bilgisini ayır
        var parts = sendedMissionDate.split('-');
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
        const missionDate = new Date( year, month, day, hours, minutes );

        let extraMissionInfo;
        if( isExtraMission ){
            extraMissionInfo = {
                paymentDataId: paymentDataId,
                orderUniqueCode: orderUniqueCode,
                sanalPosIslemId: sanalPosIslemId,
                subSellerGuid: subSellerGuid,
                paidPrice: `${ priceData.price } ${ priceData.priceType }`
            };

            careGive.prices.maxMissionCount = careGive.prices.maxMissionCount + 1;
            careGive.prices.boughtExtra = careGive.prices.boughtExtra + 1;
            careGive.markModified( "prices" );
        }

        careGive.missionCallender
                .push(
                    {
                        missionDesc: missionDesc,
                        missionDate: missionDate,
                        missionDeadline: new Date( missionDate.getTime() + 1 * 60 * 60 * 1000 ),
                        isExtra: isExtraMission,
                        extraMissionInfo: extraMissionInfo
                    }
                );
        careGive.markModified( "missionCallender" );

        const savedCareGive = await careGive.save();

        const savedMission = savedCareGive.missionCallender
                                          .find(
                                            missionObject =>
                                                missionObject.missionDate === missionDate
                                                && missionObject.missionDesc === missionDesc
                                          );

        if( !savedMission ){
            return {
                error: true,
                serverStatus: -1,
                message: "Mission Not Found"
            };
        }

        await sendNotification(
            savedCareGive.petOwner.petOwnerId.toString(),
            savedCareGive.careGiver.careGiverId.toString(),
            "newMission",
            savedMission._id.toString(),
            "careGive",
            savedCareGive._id.toString(),
            null,
            null,
            null,
            null
        );

        return {
            error: false,
            serverStatus: 1,
            message: `Mission Scheduled Successfully`,
            payData: null,
            ticketId: savedCareGive._id.toString()
        };
    }catch( err ){
        console.log( "ERROR: prepareExtraMissionHelper - ", err );
        return {
            error: true,
            serverStatus: -1,
            message: "Internal Server Error"
        };
    }
};

export default prepareExtraMissionHelper;