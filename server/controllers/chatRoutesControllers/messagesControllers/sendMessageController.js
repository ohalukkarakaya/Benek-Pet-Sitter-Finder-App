import Chat from "../../../models/Chat/Chat.js";
import EventInvitation from "../../../models/Event/Invitations/InviteEvent.js";
import Event from "../../../models/Event/Event.js";
import CareGive from "../../../models/CareGive/CareGive.js";
import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";

import dotenv from "dotenv";
import io from "socket.io-client";

import writeMessageToChatHelper from "../../../utils/writeMessageToChatHelper.js";
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

        // eğer mesaj tipi hatalıysa hata dön
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

        // mesaj tipi yazıysa ve mesaj yoksa hata dön
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

        // eğer dosya gönderildiyse ve medya sunucusuna yüklenen dosya
        // yolu eksikse hata dön
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

        // eğer ödeme teklifi açıldıysa ve ödeme istenilen içeriğin idsi
        // ve tipi eksikse hata dön
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

        // eğer başka bir kullanıcının ya da evcil hayvanın
        // profili gönderildiyse ve kullanıcının idsi eksikse
        // hata dön
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


        // sohbet objesini bul, bulunamazsa hata dön
        const chat = await Chat.findById( chatId );
        if( !chat ){
            return res.status(404).json(
                {
                    error: true,
                    message: "chat not found"
                }
            );
        }

        // istek atan kullanıcının sohbet üyesi olup olmadığını kontrol et
        // eğer değilse hata dön
        const isUserMember = chat.members.some(
            member =>
                member.userId.toString() === userId
                && !( member.leaveDate )
        ).length > 0;
        if( !isUserMember ){
            return res.status(401).json(
                {
                    error: true,
                    message: "un authorized"
                }
            );
        }

        // sohbet üyelerinin user Idlerinden oluşan bir liste olultur
        const chatMembers = chat.members
                                .filter( member => !( member.leaveDate ) )
                                .map( member => member.userId );

        //mesajı chat objesine yaz ve kaydet
        const savedMessage = await writeMessageToChatHelper(
            chat,
            chatMembers,
            messageType,
            userId,
            fileUrlPath,
            message,
            paymentType,
            paymentReleatedRecordId,
            IdOfTheUserOrPetWhichProfileSended
        );
        if( savedMessage.error ){
            return res.status( savedMessage.status )
                      .json(
                        {
                            error: true,
                            message: savedMessage.message
                        }
                      );
        }

        // chat objesinden gönderilecek mesajı al
        const messageToSend = savedMessage;
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