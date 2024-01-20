import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";
import getLightWeightPetInfoHelper from "../../getLightWeightPetInfoHelper.js";
import getLightWeightUserInfoHelper from "../../getLightWeightUserInfoHelper.js";

const prepareStarNotificationDataHelper = async ( notification ) => {
    try{
        const votedUser = await User.findById( notification.from.toString() );

        if( !votedUser ){
            return {
                error: true,
                message: "user not found"
            }
        }

        const user = await User.findById( notification.to[0].toString() );
        if( !user ){
            return {
                error: true,
                message: "user not found"
            }
        }
                        
        const votedUserInfo = getLightWeightUserInfoHelper( votedUser );

        const starObject = user.stars.find(
            starObject =>
                starObject._id.toString() === notification.releatedContent.id.toString()
        );

        if( !user ){
            return {
                error: true,
                message: "star Object not found"
            }
        }

        const pet = await Pet.findById( starObject.petId.toString() );
        if( !pet ){
            return {
                error: true,
                message: "pet not found"
            }
        }

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