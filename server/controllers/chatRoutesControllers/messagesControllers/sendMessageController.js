import Chat from "../../../models/Chat/Chat.js";
import EventInvitation from "../../../models/Event/Invitations/InviteEvent.js";
import Event from "../../../models/Event/Event.js";
import CareGive from "../../../models/CareGive/CareGive.js";
import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";

import dotenv from "dotenv";
import io from "socket.io-client";

import sendNotification from "../../../utils/notification/sendNotification.js";
import getLightWeightUserInfoHelper from "../../../utils/getLightWeightUserInfoHelper.js";

dotenv.config();

const socket = io( process.env.SOCKET_URL );


const sendMessageController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();

        const chatId = req.params.chatId.toString();
        const messageType = req.params.messageType.toString();
        const IdOfTheUserOrPetWhichProfileSended = req.body.IdOfTheUserWhichProfileSended;
        const fileUrlPath = req.chatFilePath;
        const message = req.body.message;
        const paymentType = req.body.paymentType;
        const paymentReleatedRecordId = req.body.paymentReleatedRecordId;

        if( !chatId || !messageType ){
            return res.status(400).json(
                {
                    error: true,
                    message: "missing params"
                }
            );
        }

        if(
            messageType !== "Text"
            && messageType !== "File"
            && messageType !== "PaymentOffer"
            && messageType !== "UserProfile"
            && messageType !== "PetProfile"
        ){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "wrong message type"
                            }
                       );
        }

        if( 
            messageType === "Text" 
            && !message
        ){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "Message missing"
                            }
                       );
        }

        if(
            messageType === "File"
            && !fileUrlPath
        ){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "Error with file"
                            }
                       );
        }

        if(
            messageType === "PaymentOffer"
            && !(
                paymentType === "EventInvitation"
                || paymentType === "CareGive"
            )
            && !(
                paymentType
                && paymentReleatedRecordId
            )
        ){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "Error with payment"
                            }
                       );
        }

        if(
            (
                messageType === "UserProfile"
                || messageType === "PetProfile"
            )
            && !IdOfTheUserOrPetWhichProfileSended
        ){
            return res.status(400).json(
                {
                    error: true,
                    message: "missing param"
                }
            );
        }

        const chat = await Chat.findById( chatId );
        if( !chat ){
            return res.status(404).json(
                {
                    error: true,
                    message: "chat not found"
                }
            );
        }

        const isUserMember = chat.members.some(
            member =>
                member.userId.toString() === userId
        );
        if( !isUserMember ){
            return res.status(401).json(
                {
                    error: true,
                    message: "un authorized"
                }
            );
        }

        const chatMembers = chat.members.map( member => member.userId );

        //text mesajını ekle
        if( messageType === "Text" ){

            const messageObject = {
                sendedUserId: userId,
                messageType: messageType,
                message: message,
                seenBy: [
                    userId
                ],
                sendDate: Date.now()
            }

            chat.messages.push( messageObject );
        }else if( messageType === "File" ){
            //file mesajını ekle

            const messageObject = {
                sendedUserId: userId,
                messageType: messageType,
                fileUrl: fileUrlPath,
                seenBy: [
                    userId
                ],
                sendDate: Date.now()
            }

            chat.messages.push( messageObject );
        }else if( messageType === "PaymentOffer"){
            //payment offer mesajını ekle

            if( paymentType === "EventInvitation" ){

                const invitation = await EventInvitation.findById( paymentReleatedRecordId );
                if( !invitation ){
                    return res.status(404).json(
                        {
                            error: true,
                            message: "Invitation not found"
                        }
                    );
                }

                const eventAdmin = invitation.eventAdminId.toString();
                const invitedId = invitation.invitedId.toString();

                if( eventAdmin !== userId || !(chatMembers.includes( invitedId )) ){
                    return res.status(401).json(
                        {
                            error: true,
                            message: "UnAthorized"
                        }
                    );
                }

                const messageObject = {
                    sendedUserId: userId,
                    messageType: messageType,
                    paymentOffer: {
                        receiverUserId: invitedId,
                        paymentType: paymentType,
                        releatedRecordId: paymentReleatedRecordId
                    },
                    seenBy: [
                        userId
                    ],
                    sendDate: Date.now()
                }

                chat.messages.push( messageObject );

            }else if( paymentType === "CareGive" ){
                
                const careGive = await CareGive.findById( paymentReleatedRecordId );
                if( !careGive ){
                    return res.status(404).json(
                        {
                            error: true,
                            message: "Invitation not found"
                        }
                    );
                }

                const invitation = careGive.invitation;
                if( 
                    !(invitation.from.toString() !== userId) 
                    || !(chatMembers.includes( invitation.to.toString() ))
                ){
                    return res.status(401).json(
                        {
                            error: true,
                            message: "UnAthorized"
                        }
                    );
                }

                const messageObject = {
                    sendedUserId: userId,
                    messageType: messageType,
                    paymentOffer: {
                        receiverUserId: invitedId,
                        paymentType: paymentType,
                        releatedRecordId: paymentReleatedRecordId
                    },
                    seenBy: [
                        userId
                    ],
                    sendDate: Date.now()
                }

                chat.messages.push( messageObject );
            }

        }else if( messageType === "UserProfile" ){
            //user profili mesajını ekle

            const sharedProfileUser = await User.findById( IdOfTheUserOrPetWhichProfileSended );
            if( !sharedProfileUser ){
                return res.status(404).json(
                    {
                        error: true,
                        message: "User not found"
                    }
                );
            }

            const messageObject = {
                sendedUserId: userId,
                messageType: messageType,
                IdOfTheUserOrPetWhichProfileSended: sharedProfileUser._id.toString(),
                seenBy: [
                    userId
                ],
                sendDate: Date.now()
            }

            chat.messages.push( messageObject );

        }else if( messageType === "PetProfile" ){
            //pet profili mesajını ekle

            const sharedProfilePet = await Pet.findById( IdOfTheUserOrPetWhichProfileSended );
            if( !sharedProfilePet ){
                return res.status(404).json(
                    {
                        error: true,
                        message: "Pet not found"
                    }
                );
            }
            
            const messageObject = {
                sendedUserId: userId,
                messageType: messageType,
                IdOfTheUserOrPetWhichProfileSended: sharedProfilePet._id.toString(),
                seenBy: [
                    userId
                ],
                sendDate: Date.now()
            }

            chat.messages.push( messageObject );

        }else if( messageType === "Event" ){
            //pet profili mesajını ekle

            const sharedProfileEvent = await Event.findById( IdOfTheUserOrPetWhichProfileSended );
            if( !sharedProfileEvent ){
                return res.status(404).json(
                    {
                        error: true,
                        message: "Event not found"
                    }
                );
            }

            const willJoin = sharedProfileEvent.willJoin;
            const joined = sharedProfileEvent.joined;

            const authorizedUsers = Array.from(
                new Set(
                    willJoin.concat( joined )
                )
            );

            const unAuthorizedUsersInChat = chatMembers.filter(
                memberId =>
                    !authorizedUsers.includes( memberId )
            );

            if(
                sharedProfileEvent.isPrivate
                && unAuthorizedUsersInChat
            ){
                return res.status(401).json(
                    {
                        error: true,
                        message: "UnAthorized"
                    }
                );
            }
            
            const messageObject = {
                sendedUserId: userId,
                messageType: messageType,
                IdOfTheUserOrPetWhichProfileSended: sharedProfileEvent._id.toString(),
                seenBy: [
                    userId
                ],
                sendDate: Date.now()
            }

            chat.messages.push( messageObject );
        }

        chat.markModified( "messages" );
        const savedChat = await chat.save();
        if( !savedChat ) {
            console.error( `ERROR: While send message!` );
            return res.status( 500 )
                      .json(
                            {
                                error: true,
                                message: "Internal Server Error"
                            }
                      );
        }

        const messageToSend = savedChat.messages[ savedChat.messages.length - 1 ];
        let seenByList = [];
        for( let seenUserId of messageToSend.seenBy ){
            let userData = await User.findById( seenUserId );
            if( !userData ){ break; }

            let userInfo = getLightWeightUserInfoHelper( userData );

            if( userInfo ){
                seenByList.push( userInfo );
            }
        }

        if( seenByList.length === messageToSend.seenBy.length ){
            messageToSend.seenBy = seenByList
        }

        let chatMemberInfoList = [];
        for( let member of chat.members ){
            let memberObject = await User.findById( member.userId );
            if( !memberObject ){ break; }

            let memberInfo = getLightWeightUserInfoHelper( memberObject );
            chatMemberInfoList.push( memberInfo );
        }

        const responseChat = {
            id: savedChat._id.toString(),
            members: chatMemberInfoList,
            chatStratDate: savedChat.chatStartDate,
            chatName: savedChat.chatName,
            chatDesc: savedChat.chatDesc,
            chatImageUrl: savedChat.chatImageUrl,
            message: messageToSend
        }
        
        //send responseChat data to socket server
        const newChatMembers = savedChat.members.map( member => member.userId );
        const receiverList = newChatMembers.filter( memberId => memberId.toString() !== userId );

        await sendNotification( userId, receiverList, "message", messageToSend._id.toString(), "chat", responseChat.id, null, null, null, null );
        
        socket.emit(
            "sendMessage",
            responseChat,
            receiverList
        );

        return res.status( 200 )
                  .json(
                    {
                        error: true,
                        message: "message sended succesfully",
                        chat: responseChat
                    }
                  );
    }catch( err ){
        console.log( err );
        res.status( 500 )
           .json(
                {
                    error: true,
                    message: "Internal Server Error"
                }
            );
    }
}

export default sendMessageController