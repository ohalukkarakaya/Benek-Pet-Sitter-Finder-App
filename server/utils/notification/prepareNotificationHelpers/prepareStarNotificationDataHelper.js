import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";
import getLightWeightPetInfoHelper from "../../getLightWeightPetInfoHelper.js";
import getLightWeightUserInfoHelper from "../../getLightWeightUserInfoHelper.js";

const prepareStarNotificationDataHelper = async ( notification ) => {
    try{
        const votedUser = await User.findById( 
                                        notification.from
                                                    .toString()
                                     );

        const user = await User.findById( 
                                    notification.to[0]
                                                .toString()
                                );
                        
        const votedUserInfo = getLightWeightUserInfoHelper( votedUser );

        const starObject = user.stars
                                .find(
                                    starObject =>
                                        starObject._id
                                                  .toString() === notification.releatedContent
                                                                              .id
                                                                              .toString()
                                );

        const pet = await Pet.findById(
                                starObject.petId
                                            .toString()
                                );

        const petInfo = getLightWeightPetInfoHelper( pet );
                        
        const notificationData = {
            contentType: "star",
            notificationId: notification._id.toString(),
            user: votedUserInfo,
            pet: petInfo,
            date: starObject.date,
            star: starObject.star
        };

        return notificationData;
    }catch( err ){
        console.log( "ERROR: prepareStarNotificationDataHelper - ", err );
        return err;
    }
}

export default prepareStarNotificationDataHelper;