import CareGive from "../../../models/CareGive/CareGive.js";
import Pet from "../../../models/Pet.js";
import User from "../../../models/User.js";

import getLightWeightPetInfoHelper from "../../getLightWeightPetInfoHelper.js";
import getLightWeightUserInfoHelper from "../../getLightWeightUserInfoHelper.js";

const prepareMissionUploadNotificationDataHelper = async ( notification ) => {
    try{
        const careGive = await CareGive.findById(
                                            notification.parentContent
                                                        .id
                                                        .toString()
                                        );

        const mission = careGive.missionCallender
                                .find(
                                    missionObject =>
                                            missionObject._id
                                                         .toString() === notification.releatedContent
                                                                                     .id
                                                                                     .toString()
                                );

        const careGiver = await User.findById(
                                        careGive.careGiver
                                                .careGiverId
                                                .toString()
                                    );

        const pet = await Pet.findById(
                                    careGive.petId
                                            .toString()
                              );

        const careGiverInfo = getLightWeightUserInfoHelper( careGiver );
        const petInfo = getLightWeightPetInfoHelper( pet );

        const notificationData = {
            contentType: "missionUpload",
            notificationId: notification._id.toString(),
            careGiveId: careGive._id.toString(),
            missionId: mission._id.toString(),
            careGiver: careGiverInfo,
            pet: petInfo,
            missionDate: mission.missionDate,
            mssionDeadLine: mission.missionDeadline,
            missionDesc: mission.missionDesc,
            date: notification.date
        }

        return notificationData;
    }catch( err ){
        console.log( "ERROR: prepareMissionUploadNotificationDataHelper - ", err );
        return err;
    }
}

export default prepareMissionUploadNotificationDataHelper;