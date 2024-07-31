import CareGive from "../../../models/CareGive/CareGive.js";
import Pet from "../../../models/Pet.js";
import User from "../../../models/User.js";

import getLightWeightPetInfoHelper from "../../getLightWeightPetInfoHelper.js";
import getLightWeightUserInfoHelper from "../../getLightWeightUserInfoHelper.js";

const prepareCareGiveInvitationNotificationDataHelper = async ( notification ) => {
    try{
        const invitedCareGive = await CareGive.findById( 
                                                    notification.releatedContent
                                                                .id
                                                                .toString()
                                               );

        if( !invitedCareGive ){
            return {
                error: true,
                message: "invitedCareGive not found"
            }
        }

        const careGiver = await User.findById(
                                        invitedCareGive.careGiver
                                                       .careGiverId
                                                       .toString()
                                    );

        if( !careGiver ){
            return {
                error: true,
                message: "careGiver not found"
            }
        }

        const careGiverInfo = getLightWeightUserInfoHelper( careGiver );

        const pet = await Pet.findById(
                                    invitedCareGive.petId
                                                   .toString()
                              );

        if( !pet ){
            return {
                error: true,
                message: "pet not found"
            }
        }

        const petInfo = await getLightWeightPetInfoHelper( pet );

        const priceInfo = {
            priceType: invitedCareGive.prices.priceType,
            servicePrice: invitedCareGive.prices.servicePrice
        };

        const notificationData = {
            error: false,
            contentType: "careGiveInvitation",
            notificationId: notification._id.toString(),
            careGiveId: invitedCareGive._id.toString(),
            invitationDate: invitedCareGive.invitation.at,
            carGiver: careGiverInfo,
            pet: petInfo,
            price: priceInfo,
            date: notification.date
        };

        return notificationData;
    }catch( err ){
        console.log( "ERROR: prepareCareGiveInvitationNotificationDataHelper - ", err );
        return err;
    }
}

export default prepareCareGiveInvitationNotificationDataHelper;