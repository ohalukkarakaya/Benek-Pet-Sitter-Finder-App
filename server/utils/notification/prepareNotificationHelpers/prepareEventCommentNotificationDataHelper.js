import Event from "../../../models/Event/Event.js";
import User from "../../../models/User.js";

import getLightWeightUserInfoHelper from "../../getLightWeightUserInfoHelper.js";

const prepareEventCommentNotificationDataHelper = async ( notification ) => {
    try{
        const releatedEvent = await Event.findById(
                                              notification.secondParentContent
                                                          .id
                                                          .toString()
                                          );

        if( !releatedEvent ){
            return {
                error: true,
                message: "releated event not found"
            }
        }

        const afterEvent = releatedEvent.afterEvent
                                        .find(
                                            afterEventObject =>
                                                afterEventObject._id
                                                                .toString() === notification.parentContent
                                                                                            .id
                                                                                            .toString()
                                        );

        if( !afterEvent ){
            return {
                error: true,
                message: "after event not found"
            }
        }

        const comment = afterEvent.comments
                                  .find(
                                      commentObject =>
                                          commentObject._id
                                                       .toString() === notification.releatedContent
                                                                                   .id
                                                                                   .toString()
                                   );

        if( !comment ){
            return {
                error: true,
                message: "comment not found"
            }
        }

        const commentUser = await User.findById(
                                            comment.userId
                                                   .toString()
                                       );

        if( !commentUser ){
            return {
                error: true,
                message: "commentUser not found"
            }
        }

        const commentUserInfo = getLightWeightUserInfoHelper( commentUser );

        const notificationData = {
            error: false,
            contentType: "eventComment",
            notificationId: notification._id.toString(),
            user: commentUserInfo,
            eventId: releatedEvent._id.toString(),
            eventImg: releatedEvent.imgUrl,
            afterEventId: afterEvent._id.toString(),
            commentId: comment._id.toString(),
            comment: comment.comment,
            commentDate: comment.createdAt,
            date: notification.date
        }

        return notificationData;
    }catch( err ){
        console.log( "ERROR: prepareEventCommentNotificationDataHelper - ", err );
        return err;
    }
}

export default prepareEventCommentNotificationDataHelper;