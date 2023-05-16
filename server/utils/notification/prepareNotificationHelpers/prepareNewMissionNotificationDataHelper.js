import CareGive from "../../../models/CareGive/CareGive.js";
import Pet from "../../../models/Pet.js";
import User from "../../../models/User.js";

import getLightWeightPetInfoHelper from "../../getLightWeightPetInfoHelper.js";
import getLightWeightUserInfoHelper from "../../getLightWeightUserInfoHelper.js";

const prepareNewMissionNotificationDataHelper = async ( notification ) => {
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

        const petOwner = await User.findById(
                                        careGive.petOwner
                                                .petOwnerId
                                                .toString()
                                    );

        const pet = await Pet.findById(
                                    careGive.petId
                                            .toString()
                              );

        const petOwnerInfo = getLightWeightUserInfoHelper( petOwner );
        const petInfo = getLightWeightPetInfoHelper( pet );

        const notificationData = {
            contentType: "newMission",
            notificationId: notification._id.toString(),
            careGiveId: careGive._id.toString(),
            missionId: mission._id.toString(),
            petOwner: petOwnerInfo,
            pet: petInfo,
            missionDate: mission.missionDate,
            mssionDeadLine: mission.missionDeadline,
            missionDesc: mission.missionDesc,
            date: notification.date
        }

        return notificationData;
    }catch( err ){
        console.log( "ERROR: prepareNewMissionNotificationDataHelper - ", err );
        return err;
    }
}

export default prepareNewMissionNotificationDataHelper;