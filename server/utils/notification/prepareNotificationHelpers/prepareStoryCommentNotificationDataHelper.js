import Story from "../../../models/Story.js";
import User from "../../../models/User.js";
import getLightWeightUserInfoHelper from "../../getLightWeightUserInfoHelper.js";

const prepareStoryCommentNotificationDataHelper = async ( notification ) => {
    try{
        const story = await Story.findById( notification.parentContent.id.toString() );
        if( !story ){
            return {
                error: true,
                message: "story not found"
            }
        }
        
        const comment = story.comments.find(
            commentObject =>
                commentObject._id.toString() === notification.releatedContent.id.toString()
        );

        if( !comment ){
            return {
                error: true,
                message: "comment not found"
            }
        }

        const commentUser = await User.findById( comment.userId.toString() );
        if( !commentUser ){
            return {
                error: true,
                message: "commentUser not found"
            }
        }

        const commentUserInfo = getLightWeightUserInfoHelper( commentUser );
        const notificationData = {
            error: false,
            contentType: "storyComment",
            notificationId: notification._id.toString(),
            user: commentUserInfo,
            storyId: story._id.toString(),
            commentId: comment._id.toString(),
            comment: comment.comment,
            date: notification.date
        };

        return notificationData;
        
    }catch( err ){
        console.log( "ERROR: prepareStarNotificationDataHelper - ", err );
        return err;
    }
}

export default prepareStoryCommentNotificationDataHelper;