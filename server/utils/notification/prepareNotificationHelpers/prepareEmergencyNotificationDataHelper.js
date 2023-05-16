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

        const pet = await Pet.findById(
                                 careGive.petId
                                         .toString()
                              );

        const careGiver = await User.findById(
                                        careGive.careGiver
                                                .careGiverId
                                                .toString()
                                     );

        const petInfo = getLightWeightPetInfoHelper( pet );
        const careGiverInfo = getLightWeightUserInfoHelper( careGiver );

        const notificationData = {
            contentType: "emergency",
            notificationId: notification._id.toString(),
            careGiveId: careGive._id.toString(),
            careGiver: careGiverInfo,
            petInfo: petInfo,
            date: notification.date
        }

        return notification;
    }catch( err ){
        console.log( "ERROR: prepareEmergencyNotificationDataHelper - ", err );
        return err;
    }
}

export default prepareEmergencyNotificationDataHelper;