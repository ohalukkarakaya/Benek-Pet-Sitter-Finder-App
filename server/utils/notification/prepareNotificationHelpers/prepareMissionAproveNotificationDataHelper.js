import CareGive from "../../../models/CareGive/CareGive.js";
import Pet from "../../../models/Pet.js";
import User from "../../../models/User.js";

import getLightWeightPetInfoHelper from "../../getLightWeightPetInfoHelper.js";
import getLightWeightUserInfoHelper from "../../getLightWeightUserInfoHelper.js";

const prepareMissionAproveNotificationDataHelper = async ( notification ) => {
    try{
        const careGive = await CareGive.findById(
                                            notification.parentContent
                                                        .id
                                                        .toString()
                                        );

        if( !careGive ){
            return {
                error: true,
                message: "careGive not found"
            }
        }

        const mission = careGive.missionCallender
                                .find(
                                    missionObject =>
                                            missionObject._id
                                                         .toString() === notification.releatedContent
                                                                                     .id
                                                                                     .toString()
                                );

        if( !mission ){
            return {
                error: true,
                message: "mission not found"
            }
        }

        const petOwner = await User.findById(
                                        careGive.petOwner
                                                .petOwnerId
                                                .toString()
                                    );

        if( !petOwner ){
            return {
                error: true,
                message: "petOwner not found"
            }
        }

        const pet = await Pet.findById(
                                    careGive.petId
                                            .toString()
                              );

        if( !pet ){
            return {
                error: true,
                message: "pet not found"
            }
        }

        const petOwnerInfo = getLightWeightUserInfoHelper( careGiver );
        const petInfo = getLightWeightPetInfoHelper( pet );

        const notificationData = {
            error: false,
            contentType: "missionAprove",
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
        console.log( "ERROR: prepareMissionAproveNotificationDataHelper - ", err );
        return err;
    }
}

export default prepareMissionAproveNotificationDataHelper;