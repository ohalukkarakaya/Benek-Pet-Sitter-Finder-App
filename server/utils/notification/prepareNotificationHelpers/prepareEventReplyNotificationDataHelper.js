import Event from "../../../models/Event/Event.js";
import User from "../../../models/User.js";

import getLightWeightUserInfoHelper from "../../getLightWeightUserInfoHelper.js";

const prepareEventReplyNotificationDataHelper = async ( notification ) => {
    try{
        const releatedEvent = await Event.findById(
                                              notification.thirdParentContent
                                                          .id
                                                          .toString()
                                          );

        const afterEvent = releatedEvent.afterEvent
                                        .find(
                                            afterEventObject =>
                                                afterEventObject._id
                                                                .toString() === notification.secondParentContent
                                                                                            .id
                                                                                            .toString()
                                        );

        const comment = afterEvent.comments
                                  .find(
                                      commentObject =>
                                          commentObject._id
                                                       .toString() === notification.parentContent
                                                                                   .id
                                                                                   .toString()
                                   );

        const reply = comment.replies
                             .find(
                                replyObject =>
                                    replyObject._id
                                               .toString() === notification.releatedContent
                                                                           .id
                                                                           .toString()
                             );

        const repliedUser = await User.findById(
                                            reply.userId
                                                 .toString()
                                       );

        const repliedUserInfo = getLightWeightUserInfoHelper( repliedUser );

        const notificationData = {
            contentType: "eventComment",
            notificationId: notification._id.toString(),
            user: repliedUserInfo,
            eventId: releatedEvent._id.toString(),
            eventImg: releatedEvent.imgUrl,
            afterEventId: afterEvent._id.toString(),
            commentId: comment._id.toString(),
            comment: comment.comment,
            replyId: reply._id.toString(),
            reply: reply.reply,
            date: notification.date
        }

        return notificationData;
    }catch( err ){
        console.log( "ERROR: prepareEventReplyNotificationDataHelper - ", err );
        return err;
    }
}

export default prepareEventReplyNotificationDataHelper;