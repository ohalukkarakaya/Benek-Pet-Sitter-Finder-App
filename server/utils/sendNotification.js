import Notification from "../models/Notification.js";

const sendNotification = async ( 
    fromUserId, 
    toUserId, 
    contentType, 
    releatedContentId,
    parentContentType, 
    parentContentId,
    secondParentContentType, 
    secondParentContentId
) => {
    try{
        let notificationData;
        if( 
            contentType === "petImageComment"
            || contentType === "storyComment"
            || contentType === "eventComment"
            || contentType === "newMission"
            || contentType === "missionUpload"
            || contentType === "missionAprove"
        ){
            if(
                !parentContentId
                || !parentContentType
            ){
                return data = {
                    error: true,
                    errorStatusCode: 400,
                    message: "Missing Param"
                }
            }

            notificationData = {
                from: fromUserId.toString(),
                to: toUserId.toString(),
                releatedContent: {
                    id: releatedContentId,
                    contentType: contentType
                },
                parentContent: {
                    id: parentContentId,
                    contentType: parentContentType
                }
            }
        }else if(
            contentType === "petImageReply"
            || contentType === "storyReply"
            || contentType === "eventReply"
        ){
            if(
                !parentContentId
                || !parentContentType
                || !secondParentContentId
                || !secondParentContentType
            ){
                return data = {
                    error: true,
                    errorStatusCode: 400,
                    message: "Missing Param"
                }
            }

            notificationData = {
                from: fromUserId.toString(),
                to: [ toUserId.toString() ],
                releatedContent: {
                    id: releatedContentId,
                    contentType: contentType
                },
                parentContent: {
                    id: parentContentId,
                    contentType: parentContentType
                },
                secondParentContent: {
                    id: secondParentContentId,
                    contentType: secondParentContentType
                }
            }
        }else if( 
            contentType === "follow" 
            || contentType === "star"
            || contentType === "eventInvitation"
            || contentType === "careGiveInvitation"
            || contentType === "secondaryPetOwnerInvitation"
            || contentType === "petHandOverInvitation"
            || contentType === "emergency"
        ){
            notificationData = {
                from: fromUserId.toString(),
                to: [ toUserId.toString() ],
                releatedContent: {
                    id: releatedContentId,
                    contentType: contentType
                }
            }
        }else if(
            contentType === "message"
        ){
            notificationData = {
                from: fromUserId.toString(),
                to: toUserId,
                releatedContent: {
                    id: releatedContentId,
                    contentType: contentType
                }
            }
        }

        if( notificationData ){
            await new Notification( notificationData ).then(
                (notification) => {

                    //send responseChat data to socket server
                    if( contentType != "message" ){
                        socket.emit(
                            "sendNotification",
                            {
                                to: notification.to[0].toString(),
                                notification: notification
                            }
                        );
                    }

                    //To Do: push notification to firebase notification

                    return notification;
                }
            ).catch(
                (error) => {
                    if(error){
                        console.log("Error: while creating CareGiveObject - ", error);
                        return data = {
                            error: true,
                            errorStatusCode: 500,
                            message: error.message
                        }
                    }
                }
            );
        }
    }catch( err ){
            console.log("ERROR: sendNotification - ", err);
            return err;
    }
}

export default sendNotification;