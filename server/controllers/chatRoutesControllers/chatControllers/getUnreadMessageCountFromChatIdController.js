import Chat from "../../../models/Chat/Chat.js";

const getUnreadMessageCountFromChatIdController = async (req, res) => {
    try{
        let chatId = req.params.chatId.toString();
        let userId = req.params.userId.toString();

        if( !chatId || !userId ){
            return res.status( 400 )
                      .json({ error: true, message: "missing params" });
        }

        if( req.user._id.toString() !== userId &&  req.user.roles !== 1 && req.user.roles !== 3 ){
            return res.status( 401 )
                      .json({ error: true, message: "Unauthorized" });
        }

        let chat = await Chat.findById( chatId );
        if( !chat ){
            return res.status( 404 )
                      .json({ error: true, message: "chat not found" });
        }

        // Her bir mesaj için seenBy içinde userIdToCheck olmayanları bul
        const unreadMessages = chat.messages.filter(message => !message.seenBy.includes(userId));

        // Okunmamış mesaj sayısını al
        const unreadMessageCount = unreadMessages.length;

        return res.status( 200 ).json({ error: false, unreadMessageCount });

    }catch( err ){
        console.log( err );
        return res.status( 500 )
                  .json({ error: true, message: "Internal Server Error" })
    }
}

export default getUnreadMessageCountFromChatIdController;