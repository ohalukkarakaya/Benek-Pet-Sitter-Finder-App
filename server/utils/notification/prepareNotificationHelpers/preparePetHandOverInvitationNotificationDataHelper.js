import PetHandOverInvitation from "../../../models/ownerOperations/PetHandOverInvitation.js";
import Pet from "../../../models/Pet.js";
import User from "../../../models/User.js";

import getLightWeightPetInfoHelper from "../../getLightWeightPetInfoHelper.js";
import getLightWeightUserInfoHelper from "../../getLightWeightUserInfoHelper.js";

const preparePetHandOverInvitationNotificationDataHelper = async ( notification ) => {
    try{
        const invitation = await PetHandOverInvitation.findById(
                                                            notification.releatedContent
                                                                        .id
                                                                        .toString()
                                                       );

        const invitedUser = await User.findById(
                                            invitation.from
                                                      .toString()
                                       );

        const pet = await Pet.findById(
                                   invitation.petId
                                             .toString()
                              );

        invitedUserInfo = getLightWeightUserInfoHelper( invitedUser );
        petInfo = getLightWeightPetInfoHelper( pet );

        const notificationData = {
            contentType: "petHandOverInvitation",
            notificationId: notification._id.toString(),
            invitedUser: invitedUserInfo,
            pet: petInfo,
            date: notification.date
        }

        return notificationData;
    }catch( err ){
        console.log( "ERROR: preparePetHandOverInvitationNotificationDataHelper - ", err );
        return err;
    }
}

export default preparePetHandOverInvitationNotificationDataHelper;