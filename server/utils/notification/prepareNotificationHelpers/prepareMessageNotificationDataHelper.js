import User from "../../models/User.js";
import Chat from "../../models/Chat/Chat.js";
import getLightWeightUserInfoHelper from "../../getLightWeightUserInfoHelper.js";

const prepareMessageNotificationDataHelper = async ( notification ) => {
    try{
        const sendedUser = await User.findById( 
            notification.from
                        .toString()
          );

        const sendedUserInfo = getLightWeightUserInfoHelper( sendedUser );

        const chat = await Chat.findById( 
                                    notification.parentContent
                                                .id
                                                .toString()
                                );

        const message = chat.messages
                            .find(
                                message =>
                                    message._id
                                        .toString() === notification.releatedContent
                                                                    .id 
                                                                    .toString()
                            );

        switch( message.messageType ){
            case "Text":
                message.messageInfo = {
                    chatId: chat._id
                                .toString(),
                    chatName: chat.chatName,
                    message: message.message,
                    date: message.sendDate
                };
            break;

            case "File":
                message.messageInfo = {
                    chatId: chat._id
                                .toString(),
                    chatName: chat.chatName,
                    message: "Send a file...",
                    date: message.sendDate
                };
            break;

            case "PaymentOffer":
                message.messageInfo = {
                    chatId: chat._id
                                .toString(),
                    chatName: chat.chatName,
                    message: "Send a payment...",
                    date: message.sendDate
                };
            break;

            case "UserProfile":
                message.messageInfo = {
                    chatId: chat._id
                                .toString(),
                    chatName: chat.chatName,
                    message: "Send an user profiie...",
                    date: message.sendDate
                };
            break;

            case "PetProfile":
                message.messageInfo = {
                    chatId: chat._id
                                .toString(),
                    chatName: chat.chatName,
                    message: "Send a pet profiie...",
                    date: message.sendDate
                };
            break;

            case "Event":
                message.messageInfo = {
                    chatId: chat._id
                                .toString(),
                    chatName: chat.chatName,
                    message: "Send an event...",
                    date: message.sendDate
                };
            break;
        }

        const notificationData = {
            contentType: "message",
            notificationId: notification._id.toString(),
            user: sendedUserInfo,
            message: message.messageInfo,
            date: notification.date
        };

        return notificationData;
    }catch( err ){
        console.log( "ERROR: prepareMessageNotificationDataHelper - ", err );
        return err;
    }
}

export default prepareMessageNotificationDataHelper;