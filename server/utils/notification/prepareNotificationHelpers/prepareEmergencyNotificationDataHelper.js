import CareGive from "../../../models/CareGive/CareGive.js";
import Pet from "../../../models/Pet.js";
import User from "../../../models/User.js";

import getLightWeightPetInfoHelper from "../../getLightWeightPetInfoHelper.js";
import getLightWeightUserInfoHelper from "../../getLightWeightUserInfoHelper.js";

const prepareEmergencyNotificationDataHelper = async ( notification ) => {
    try{
        const careGive = await CareGive.findById(
                                            notification.releatedContent
                                                        .id
                                                        .toString()
                                        );

        if( !careGive ){
            return {
                error: true,
                message: "careGive not found"
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

        const careGiver = await User.findById(
                                        careGive.careGiver
                                                .careGiverId
                                                .toString()
                                     );

        const petInfo = await getLightWeightPetInfoHelper( pet );
        const careGiverInfo = getLightWeightUserInfoHelper( careGiver );

        const notificationData = {
            error: false,
            contentType: "emergency",
            notificationId: notification._id.toString(),
            careGiveId: careGive._id.toString(),
            careGiver: careGiverInfo,
            petInfo: petInfo,
            date: notification.date
        }

        return notificationData;
    }catch( err ){
        console.log( "ERROR: prepareEmergencyNotificationDataHelper - ", err );
        return err;
    }
}

export default prepareEmergencyNotificationDataHelper;