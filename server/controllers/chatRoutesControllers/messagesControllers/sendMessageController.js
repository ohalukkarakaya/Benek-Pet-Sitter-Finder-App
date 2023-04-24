import Chat from "../../../models/Chat.js";
import EventInvitation from "../../../models/Event/Invitations/InviteEvent.js";

const sendMessageController = async (req, res) => {
    try{
        const userId = req.user._id.toString();

        const chatId = req.params.chatId.toString();
        const messageType = req.body.messageType.toString();
        const IdOfTheUserOrPetWhichProfileSended = req.body.IdOfTheUserWhichProfileSended.toString();
        const fileUrlPath = req.chatFileCdnPath.toString();
        const message = req.body.message.toString();
        const paymentType = req.body.paymentType.toString();
        const paymentReleatedRecordId = req.body.paymentReleatedRecordId.toString();

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
            || messageType !== "File"
            || messageType !== "PaymentOffer"
            || messageType !== "UserProfile"
            || messageType !== "PetProfile"
        ){
            return res.status(400).json(
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
            return res.status(400).json(
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
            return res.status(400).json(
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
            return res.status(400).json(
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

        const isUserMember = chat.members.where(
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

            chat.messages.add( messageObject );
        }

        //file mesajını ekle
        if( messageType === "File" ){

            const messageObject = {
                sendedUserId: userId,
                messageType: messageType,
                fileUrl: fileUrlPath,
                seenBy: [
                    userId
                ],
                sendDate: Date.now()
            }

            chat.messages.add( messageObject );
        }   

        //payment offer mesajını ekle
        if( messageType === "PaymentOffer"){

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
                const chatMembers = chat.members.map( member => member.userId );

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
                        paymentType: "EventInvitation",
                        releatedRecordId: paymentReleatedRecordId
                    },
                    seenBy: [
                        userId
                    ],
                    sendDate: Date.now()
                }

                chat.messages.add( messageObject );

            }else if( paymentType === "CareGive" ){

            }

        }

        //user profili mesajını ekle
        if( messageType === "UserProfile" ){

        }

        //pet profili mesajını ekle
        if( messageType === "PetProfile" ){
            
        }

        chat.markModified("messages");
        chat.save(
            function (err) {
                if(err) {
                    console.error(`ERROR: While send message!, ${err}`);
                    return res.status(500).json(
                        {
                            error: true,
                            message: "Internal Server Error"
                        }
                    );
                }
                }
        ).then(
            ( chat ) => {
                if( !chat ) {
                    console.error(`ERROR: While send message!, ${err}`);
                    return res.status(500).json(
                        {
                            error: true,
                            message: "Internal Server Error"
                        }
                    );
                }

                const responseChat = {
                    id: chat._id.toString(),
                    members: chat.members,
                    chatStratDate: chat.chatStartDate,
                    chatName: chat.chatName,
                    chatDesc: chat.chatDesc,
                    chatImageUrl: chat.chatImageUrl,
                    message: chat.messages[ chat.messages.length - 1 ]
                }

                //send response chat to socket server

                return res.status(200).json(
                    {
                        error: true,
                        message: "message sended succesfully",
                        chat: responseChat
                    }
                );
            }
        );
        
    }catch(err){
        console.log(err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default sendMessageController