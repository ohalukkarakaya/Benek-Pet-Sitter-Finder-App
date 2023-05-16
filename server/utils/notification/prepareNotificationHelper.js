import User from "../../models/User.js";
import Pet from "../../models/Pet.js";
import Chat from "../../models/Chat/Chat.js";

import prepareFollowNotificationDataHelper from "./prepareNotificationHelpers/prepareFollowNotificationDataHelper.js";
import prepareMessageNotificationDataHelper from "./prepareNotificationHelpers/prepareMessageNotificationDataHelper.js";
import prepareStarNotificationDataHelper from "./prepareNotificationHelpers/prepareStarNotificationDataHelper.js";

import preparePetImageCommentNotificationDataHelper from "./prepareNotificationHelpers/preparePetImageCommentNotificationDataHelper.js";
import preparePetImageReplyNotificationDataHelper from "./prepareNotificationHelpers/preparePetImageReplyNotificationDataHelper.js";

import prepareStoryCommentNotificationDataHelper from "./prepareNotificationHelpers/prepareStoryCommentNotificationDataHelper.js";
import prepareStoryReplyNotificationDataHelper from "./prepareNotificationHelpers/prepareStoryReplyNotificationDataHelper.js";

import prepareEventCommentNotificationDataHelper from "./prepareNotificationHelpers/prepareEventCommentNotificationDataHelper.js";
import prepareEventReplyNotificationDataHelper from "./prepareNotificationHelpers/prepareEventReplyNotificationDataHelper.js";

import prepareEventInvitationNotificationDataHelper from "./prepareNotificationHelpers/prepareEventInvitationNotificationDataHelper.js";
import prepareCareGiveInvitationNotificationDataHelper from "./prepareNotificationHelpers/prepareCareGiveInvitationNotificationDataHelper.js";
import prepareSecondaryPetOwnerInvitationNotificationDataHelper from "./prepareNotificationHelpers/prepareSecondaryPetOwnerInvitationNotificationDataHelper.js";

const getNotificationHelper = async( notificationList ) => {
    try{
        notificationList.forEach(
            async ( notification ) => {
                switch ( 
                    notification.releatedContent
                                .contentType
                ){
                    case "follow":
                        try{
                            const notificationData = await prepareFollowNotificationDataHelper( notification );
                            notification = notificationData;
                        }catch( err ){
                            console.log( "ERROR: prepare follow notification data - ", err );
                            return err;
                        }
                    break;


                    case "message":
                        try{
                            const notificationData = await prepareMessageNotificationDataHelper( notification );
                            notification = notificationData;
                        }catch( err ){
                            console.log( "ERROR: prepare message notification data - ", err );
                            return err;
                        }
                     break;


                    case "star":
                        try{
                            const notificationData = await prepareStarNotificationDataHelper( notification );
                            notification = notificationData;
                        }catch( err ){
                            console.log( "ERROR: prepare star notification data - ", err );
                            return err;
                        }
                    break;

                    case "petImageComment":
                        try{
                            const notificationData = await preparePetImageCommentNotificationDataHelper( notification );
                            notification = notificationData;
                        }catch( err ){
                            console.log("ERROR: prepare petImageComment notification data - ", err);
                            return err;
                        }
                    break;

                    case "petImageReply":
                        try{
                            const notificationData = await preparePetImageReplyNotificationDataHelper( notification );
                            notification = notificationData;
                        }catch( err ){
                            console.log( "ERROR: prepare petImageComment notification data - ", err );
                            return err;
                        }
                    break;

                    case "storyComment":
                        try{
                            const notificationData = await prepareStoryCommentNotificationDataHelper( notification );
                            notification = notificationData;
                        }catch( err ){
                            console.log( "ERROR: prepare story comment notification data - ", err );
                            return err;
                        }
                    break;

                    case "storyReply":
                        try{
                            const notificationData = await prepareStoryReplyNotificationDataHelper( notification );
                            notification = notificationData;
                        }catch( err ){
                            console.log( "ERROR: prepare story reply notification data - ", err );
                            return err;
                        }
                    break;

                    case "eventComment":
                        try{
                            const notificationData = await prepareEventCommentNotificationDataHelper( notification );
                            notification = notificationData;
                        }catch( err ){
                            console.log( "ERROR: prepare event comment notification data - ", err );
                            return err;
                        }
                    break;

                    case "eventReply":
                        try{
                            const notificationData = await prepareEventReplyNotificationDataHelper( notification );
                            notification = notificationData;
                        }catch( err ){
                            console.log( "ERROR: prepare event reply notification data - ", err );
                            return err;
                        }
                    break;

                    case "eventInvitation":
                        try{
                            const notificationData = await prepareEventInvitationNotificationDataHelper( notification );
                            notification = notificationData;
                        }catch( err ){
                            console.log( "ERROR: prepare event invitation notification data - ", err );
                            return err;
                        }
                    break;

                    case "careGiveInvitation":
                        try{
                            const notificationData = await prepareCareGiveInvitationNotificationDataHelper( notification );
                            notification = notificationData;
                        }catch( err ){
                            console.log( "ERROR: prepare careGive invitation notification data - ", err );
                            return err;
                        }
                    break;

                    case "secondaryPetOwnerInvitation":
                        try{
                            const notificationData = await prepareSecondaryPetOwnerInvitationNotificationDataHelper( notification );
                            notification = notificationData;
                        }catch( err ){
                            console.log( "ERROR: prepare secondary petOwner invitation notification data - ", err );
                            return err;
                        }
                    break;

                    // To Do: petHandOverInvitation
                }
            }
        );
    }catch( err ){
        console.log( "ERROR: getNotificationHelper - ", err );
        return err
    }
}

export default getNotificationHelper;