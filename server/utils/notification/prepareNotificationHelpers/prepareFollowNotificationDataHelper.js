import User from "../../../models/User.js";
import getLightWeightUserInfoHelper from "../../getLightWeightUserInfoHelper.js";

const prepareFollowNotificationDataHelper = async ( notification ) => {
    try{
        const followedUser = await User.findById( 
                                            notification.from
                                                        .toString()
                                        );
        const followedUserInfo = getLightWeightUserInfoHelper( followedUser );
        const notificationData = {
            contentType: "follow",
            notificationId: notification._id.toString(),
            user: followedUserInfo,
            date: notification.date
        };

        return notificationData;
    }catch( err ){
        console.log( "ERROR: prepareFollowNotificationDataHelper - ", err );
        return err;
    }
}

export default prepareFollowNotificationDataHelper;