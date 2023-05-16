import Pet from "../../../models/Pet.js";
import User from "../../../models/User.js";

import getLightWeightUserInfoHelper from "../../getLightWeightUserInfoHelper.js";
import getLightWeightPetInfoHelper from "../../getLightWeightPetInfoHelper.js";

const preparePetImageReplyNotificationDataHelper = async ( notification ) => {
    try{
        const pet = await Pet.findById( 
                                notification.thirdParentContent
                                            .id
                                            .toString()
                              );

        const image = pet.images
                         .find(
                            imageObject =>
                                    imageObject._id
                                               .toString() === notification.secondParentContent
                                                                           .id
                                                                           .toString()
                          );

        const comment = image.comments
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

        const commentUser = await User.findById(
                                            notification.from
                                                        .toString()
                                       );

        const commentUserInfo = getLightWeightUserInfoHelper( commentUser );
        const petInfo = getLightWeightPetInfoHelper( pet );
        const notificationData = {
            contentType: "petImageReply",
            notificationId: notification._id.toString(),
            user: commentUserInfo,
            pet: petInfo,
            petImageId: image._id
                             .toString(),
            petImageUrl: image.imgUrl,
            commentId: comment._id
                              .toString(),
            comment: comment.comment,
            replyId: reply._id
                          .toString(),
            reply: reply.reply,
            date: notification.date
        };

        return notificationData;
    }catch( err ){
        console.log( "ERROR: preparePetImageReplyNotificationDataHelper - ", err );
        return err;
    }
}

export default preparePetImageReplyNotificationDataHelper;