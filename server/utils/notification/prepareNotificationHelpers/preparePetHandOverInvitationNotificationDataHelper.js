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

        if( !invitation ){
            return {
                error: true,
                message: "invitation not found"
            }
        }

        const invitedUser = await User.findById(
                                            invitation.from
                                                      .toString()
                                       );

        if( !invitedUser ){
            return {
                error: true,
                message: "user not found"
            }
        }

        const pet = await Pet.findById(
                                   invitation.petId
                                             .toString()
                              );

        if( !pet ){
            return {
                error: true,
                message: "pet not found"
            }
        }

        let invitedUserInfo = getLightWeightUserInfoHelper( invitedUser );
        let petInfo = await getLightWeightPetInfoHelper( pet );

        const notificationData = {
            error: false,
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