import Pet from "../../../models/Pet.js";
import User from "../../../models/User.js";

import getLightWeightUserInfoHelper from "../../getLightWeightUserInfoHelper.js";
import getLightWeightPetInfoHelper from "../../getLightWeightPetInfoHelper.js";

const preparePetImageCommentNotificationDataHelper = async ( notification ) => {
    try{
        const pet = await Pet.findById( 
                                notification.secondParentContent
                                            .id
                                            .toString()
                              );

        if( !pet ){
            return {
                error: true,
                message: "pet not found"
            }
        }

        const image = pet.images
                         .find(
                            imageObject =>
                                    imageObject._id
                                               .toString() === notification.parentContent
                                                                           .id
                                                                           .toString()
                          );

        if( !image ){
            return {
                error: true,
                message: "image not found"
            }
        }

        const comment = image.comments
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
                                            notification.from
                                                        .toString()
                                       );

        if( !commentUser ){
            return {
                error: true,
                message: "user not found"
            }
        }

        const commentUserInfo = getLightWeightUserInfoHelper( commentUser );
        const petInfo = await getLightWeightPetInfoHelper( pet );
        const notificationData = {
            error: false,
            contentType: "petImageComment",
            notificationId: notification._id.toString(),
            user: commentUserInfo,
            pet: petInfo,
            petImageId: image._id
                             .toString(),
            petImageUrl: image.imgUrl,
            commentId: comment._id
                              .toString(),
            comment: comment.comment,
            date: notification.date
        };

        return notificationData;
    }catch( err ){
        console.log( "ERROR: prepareStarNotificationDataHelper - ", err );
        return err;
    }
}

export default preparePetImageCommentNotificationDataHelper;