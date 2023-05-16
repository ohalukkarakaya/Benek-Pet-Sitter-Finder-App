import SecondaryOwnerInvitation from "../../../models/ownerOperations/SecondaryOwnerInvitation.js";
import Pet from "../../../models/Pet.js";
import User from "../../../models/User.js";

import getLightWeightPetInfoHelper from "../../getLightWeightPetInfoHelper.js";
import getLightWeightUserInfoHelper from "../../getLightWeightUserInfoHelper.js";

const prepareSecondaryPetOwnerInvitationNotificationDataHelper = async ( notification ) => {
    try{
        const invitation = await SecondaryOwnerInvitation.findById(
                                                                notification.releatedContent
                                                                            .id
                                                                            .toString()
                                                          );

        const pet = await Pet.findById(
                                    invitation.petId
                                              .toString()
                              );

        const petOwner = await User.findById(
                                        invitation.from
                                                  .toString()
                                    );

        const petInfo = getLightWeightPetInfoHelper( pet );
        const petOwnerInfo = getLightWeightUserInfoHelper( petOwner );

        const notificationData = {
            contentType: "secondaryPetOwnerInvitation",
            notificationId: notification._id.toString(),
            petOwner: petOwnerInfo,
            pet: petInfo,
            date: notification.date
        }

        return notificationData;
    }catch( err ){
        console.log( "ERROR: prepareSecondaryPetOwnerInvitationNotificationDataHelper - ", err );
        return err;
    }
}

export default prepareSecondaryPetOwnerInvitationNotificationDataHelper;