import Notification from "../../models/Notification.js";

import prepareNotificationHelper from "./prepareNotificationHelper.js";

const sendNotification = async ( 
    fromUserId, 
    toUserId, 
    contentType, 
    releatedContentId,
    parentContentType, 
    parentContentId,
    secondParentContentType, 
    secondParentContentId,
    thirdParentContentType,
    thirdParentContentId
) => {
    try{
        let notificationData;
        if( 
            contentType === "petImageComment"
            || contentType === "storyComment"
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
            || contentType === "eventReply"
        ){
            if( 
                !thirdParentContentType
                || !thirdParentContentId 
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
                },
                thirdParentContent: {
                    id: thirdParentContentId,
                    contentType: thirdParentContentType
                }
            }
        }else if(
            contentType === "storyReply"
            || contentType === "eventComment"
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
                },
                parentContent:{
                    id: parentContentId,
                    contentType: parentContentType
                }
            }
        }

        if( notificationData ){
            await new Notification( notificationData ).then(
                async ( notification ) => {

                    //prepare Notification to send socket
                    const preparedNotificationData = await prepareNotificationHelper( [ notification ] );
                    
                    //send responseChat data to socket server
                    if( contentType !== "message" ){
                        socket.emit(
                            "sendNotification",
                            {
                                to: notification.to[0].toString(),
                                notification: preparedNotificationData[0]
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