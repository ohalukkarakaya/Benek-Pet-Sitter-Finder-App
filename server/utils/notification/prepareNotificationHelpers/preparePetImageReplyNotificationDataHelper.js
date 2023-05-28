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

        if( !Pet ){
            return {
                error: true,
                message: "Pet Not Found"
            }
        }

        const image = pet.images
                         .find(
                            imageObject =>
                                    imageObject._id
                                               .toString() === notification.secondParentContent
                                                                           .id
                                                                           .toString()
                          );

        if( !image ){
            return {
                error: true,
                message: "image Not Found"
            }
        }

        const comment = image.comments
                             .find(
                                commentObject =>
                                        commentObject._id
                                                     .toString() === notification.parentContent
                                                                                 .id
                                                                                 .toString()
                              );

        if( !comment ){
            return {
                error: true,
                message: "comment Not Found"
            }
        }

        const reply = comment.replies
                             .find(
                                replyObject =>
                                    replyObject._id
                                               .toString() === notification.releatedContent
                                                                           .id
                                                                           .toString()
                             );

        if( !reply ){
            return {
                error: true,
                message: "reply Not Found"
            }
        }

        const commentUser = await User.findById(
                                            notification.from
                                                        .toString()
                                       );

        if( !commentUser ){
            return {
                error: true,
                message: "commentUser Not Found"
            }
        }

        const commentUserInfo = getLightWeightUserInfoHelper( commentUser );
        const petInfo = getLightWeightPetInfoHelper( pet );
        const notificationData = {
            error: false,
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