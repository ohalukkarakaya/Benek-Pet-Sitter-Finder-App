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
import preparePetHandOverInvitationNotificationDataHelper from "./prepareNotificationHelpers/preparePetHandOverInvitationNotificationDataHelper.js";

import prepareNewMissionNotificationDataHelper from "./prepareNotificationHelpers/prepareNewMissionNotificationDataHelper.js";
import prepareMissionUploadNotificationDataHelper from "./prepareNotificationHelpers/prepareMissionUploadNotificationDataHelper.js";
import prepareMissionAproveNotificationDataHelper from "./prepareNotificationHelpers/prepareMissionAproveNotificationDataHelper.js";
import prepareEmergencyNotificationDataHelper from "./prepareNotificationHelpers/prepareEmergencyNotificationDataHelper.js";

const prepareNotificationHelper = async( notificationList ) => {
    try{
        let newNotificationList = [];
        for(
            let notification
            of notificationList
        ){
            switch (
                notification.releatedContent
                            .contentType
            ){
                case "follow":
                    try{
                        const notificationData = await prepareFollowNotificationDataHelper( notification );
                        if( 
                            !( notificationData.error ) 
                        ){
                            delete notificationData.error;
                            
                            newNotificationList.push( notificationData );
                        }else{
                            break;
                        }
                    }catch( err ){
                        console.log( "ERROR: prepare follow notification data - ", err );
                        return err;
                    }
                break;


                case "message":
                    try{
                        const notificationData = await prepareMessageNotificationDataHelper( notification );
                        if( 
                            !( notificationData.error ) 
                        ){
                            delete notificationData.error;
                            
                            newNotificationList.push( notificationData );
                        }else{
                            break;
                        }
                    }catch( err ){
                        console.log( "ERROR: prepare message notification data - ", err );
                        return err;
                    }
                 break;


                case "star":
                    try{
                        const notificationData = await prepareStarNotificationDataHelper( notification );
                        if( 
                            !( notificationData.error ) 
                        ){
                            delete notificationData.error;
                            
                            newNotificationList.push( notificationData );
                        }else{
                            break;
                        }
                    }catch( err ){
                        console.log( "ERROR: prepare star notification data - ", err );
                        return err;
                    }
                break;

                case "petImageComment":
                    try{
                        const notificationData = await preparePetImageCommentNotificationDataHelper( notification );
                        if( 
                            !( notificationData.error ) 
                        ){
                            delete notificationData.error;
                            
                            newNotificationList.push( notificationData );
                        }else{
                            break;
                        }
                    }catch( err ){
                        console.log("ERROR: prepare petImageComment notification data - ", err);
                        return err;
                    }
                break;

                case "petImageReply":
                    try{
                        const notificationData = await preparePetImageReplyNotificationDataHelper( notification );
                        if( 
                            !( notificationData.error ) 
                        ){
                            delete notificationData.error;

                            newNotificationList.push( notificationData );
                        }else{
                            break;
                        }
                    }catch( err ){
                        console.log( "ERROR: prepare petImageComment notification data - ", err );
                        return err;
                    }
                break;

                case "storyComment":
                    try{
                        const notificationData = await prepareStoryCommentNotificationDataHelper( notification );
                        if( 
                            !( notificationData.error ) 
                        ){
                            delete notificationData.error;
                            
                            newNotificationList.push( notificationData );
                        }else{
                            break;
                        }
                    }catch( err ){
                        console.log( "ERROR: prepare story comment notification data - ", err );
                        return err;
                    }
                break;

                case "storyReply":
                    try{
                        const notificationData = await prepareStoryReplyNotificationDataHelper( notification );
                        if( 
                            !( notificationData.error ) 
                        ){
                            delete notificationData.error;
                            
                            newNotificationList.push( notificationData );
                        }else{
                            break;
                        }
                    }catch( err ){
                        console.log( "ERROR: prepare story reply notification data - ", err );
                        return err;
                    }
                break;

                case "eventComment":
                    try{
                        const notificationData = await prepareEventCommentNotificationDataHelper( notification );
                        if( 
                            !( notificationData.error ) 
                        ){
                            delete notificationData.error;
                            
                            newNotificationList.push( notificationData );
                        }else{
                            break;
                        }
                    }catch( err ){
                        console.log( "ERROR: prepare event comment notification data - ", err );
                        return err;
                    }
                break;

                case "eventReply":
                    try{
                        const notificationData = await prepareEventReplyNotificationDataHelper( notification );
                        if( 
                            !( notificationData.error ) 
                        ){
                            delete notificationData.error;
                            
                            newNotificationList.push( notificationData );
                        }else{
                            break;
                        }
                    }catch( err ){
                        console.log( "ERROR: prepare event reply notification data - ", err );
                        return err;
                    }
                break;

                case "eventInvitation":
                    try{
                        const notificationData = await prepareEventInvitationNotificationDataHelper( notification );
                        if( 
                            !( notificationData.error ) 
                        ){
                            delete notificationData.error;
                            
                            newNotificationList.push( notificationData );
                        }else{
                            break;
                        }
                    }catch( err ){
                        console.log( "ERROR: prepare event invitation notification data - ", err );
                        return err;
                    }
                break;

                case "careGiveInvitation":
                    try{
                        const notificationData = await prepareCareGiveInvitationNotificationDataHelper( notification );
                        if( 
                            !( notificationData.error ) 
                        ){
                            delete notificationData.error;
                            
                            newNotificationList.push( notificationData );
                        }else{
                            break;
                        }
                    }catch( err ){
                        console.log( "ERROR: prepare careGive invitation notification data - ", err );
                        return err;
                    }
                break;

                case "secondaryPetOwnerInvitation":
                    try{
                        const notificationData = await prepareSecondaryPetOwnerInvitationNotificationDataHelper( notification );
                        if( 
                            !( notificationData.error ) 
                        ){
                            delete notificationData.error;
                            
                            newNotificationList.push( notificationData );
                        }else{
                            break;
                        }
                    }catch( err ){
                        console.log( "ERROR: prepare secondary petOwner invitation notification data - ", err );
                        return err;
                    }
                break;

                case "petHandOverInvitation":
                    try{
                        const notificationData = await preparePetHandOverInvitationNotificationDataHelper( notification );
                        if( 
                            !( notificationData.error ) 
                        ){
                            delete notificationData.error;
                            
                            newNotificationList.push( notificationData );
                        }else{
                            break;
                        }
                    }catch( err ){
                        console.log( "ERROR: prepare pet handOver invitation notification data - ", err );
                        return err;
                    }
                break;

                case "newMission":
                    try{
                        const notificationData = await prepareNewMissionNotificationDataHelper( notification );
                        if( 
                            !( notificationData.error ) 
                        ){
                            delete notificationData.error;
                            
                            newNotificationList.push( notificationData );
                        }else{
                            break;
                        }
                    }catch( err ){
                        console.log( "ERROR: prepare new mission notification data - ", err );
                        return err;
                    }
                break;

                case "missionUpload":
                    try{
                        const notificationData = await prepareMissionUploadNotificationDataHelper( notification );
                        if( 
                            !( notificationData.error ) 
                        ){
                            delete notificationData.error;
                            
                            newNotificationList.push( notificationData );
                        }else{
                            break;
                        }
                    }catch( err ){
                        console.log( "ERROR: prepare mission uploaded notification data - ", err );
                        return err;
                    }
                break;

                case "missionAprove":
                    try{
                        const notificationData = await prepareMissionAproveNotificationDataHelper( notification );
                        if( 
                            !( notificationData.error ) 
                        ){
                            delete notificationData.error;
                            
                            newNotificationList.push( notificationData );
                        }else{
                            break;
                        }
                    }catch( err ){
                        console.log( "ERROR: prepare mission aproved notification data - ", err );
                        return err;
                    }
                break;

                case "emergency":
                    try{
                        const notificationData = await prepareEmergencyNotificationDataHelper( notification );
                        if( 
                            !( notificationData.error ) 
                        ){
                            delete notificationData.error;
                            
                            newNotificationList.push( notificationData );
                        }else{
                            break;
                        }
                    }catch( err ){
                        console.log( "ERROR: prepare emergency notification data - ", err );
                        return err;
                    }
                break;
            }
        }
        if( 
            newNotificationList.length > 0
        ){
            return newNotificationList;
        }else{
            return {
                error: true,
                message: "Internal Server Error"
            }
        }
    }catch( err ){
        console.log( "ERROR: prepareNotificationHelper - ", err );
        return err
    }
}

export default prepareNotificationHelper;