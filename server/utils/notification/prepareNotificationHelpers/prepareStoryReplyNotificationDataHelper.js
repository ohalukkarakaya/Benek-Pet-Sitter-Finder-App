import Story from "../../../models/Story.js";
import User from "../../../models/User.js";

import getLightWeightUserInfoHelper from "../../getLightWeightUserInfoHelper.js";

const prepareStoryReplyNotificationDataHelper = async ( notification ) => {
    try{
        const story = await Story.findById( notification.secondParentContent.id.toString() );
        if( !story ){
            return {
                error: true,
                message: "story not found"
            }
        }

        const comment = story.comments.find(
            commentObject =>
                commentObject._id.toString() === notification.parentContent.id.toString()
        );

        if( !comment ){
            return {
                error: true,
                message: "comment not found"
            }
        }

        const reply = comment.replies.find(
            replyObject =>
                replyObject._id.toString() === notification.releatedContent.id.toString()
        );

        if( !reply ){
            return {
                error: true,
                message: "reply not found"
            }
        }

        const repliedUser = await User.findById( reply.userId.toString() );
        if( !repliedUser ){
            return {
                error: true,
                message: "repliedUser not found"
            }
        }

        const repliedUserInfo = getLightWeightUserInfoHelper( repliedUser );
        const notificationData = {
            error: false,
            contentType: "storyComment",
            notificationId: notification._id.toString(),
            user: repliedUserInfo,
            storyId: story._id.toString(),
            commentId: comment._id.toString(),
            comment: comment.comment,
            replyId: reply._id.toString(),
            reply: reply.reply,
            date: notification.date
        };

        return notificationData;
        
    }catch( err ){
        console.log( "ERROR: prepareStoryReplyNotificationDataHelper - ", err );
        return err;
    }
}

export default prepareStoryReplyNotificationDataHelper;