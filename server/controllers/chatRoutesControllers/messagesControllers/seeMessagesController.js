import Chat from "../../../models/Chat/Chat.js";

const seeMessagesController = async (req, res) => {
    try{
        const userId = req.user._id.toString();
        const chatId = req.params.chtId.toString();
        const messageIdsList = [...new Set( req.body.messagesIdsList )];
        if( !chatId || !messageIdsList ){
            return res.status(400).json(
                {
                    error: true,
                    message: "Missing param"
                }
            );
        }

        const chat = await Chat.findById( chatId );
        if( !chat ){
            return res.status(404).json(
                {
                    error: true,
                    message: "Chat not found"
                }
            );
        }

        const isUserMember = chat.members.where(
            member =>
                member.userId.toString === userId
        );
        if( !isUserMember ){
            return res.status(401).json(
                {
                    error: true,
                    message: "You can2t see those messages"
                }
            );
        }

        for( let messageId in messageIdsList ){
            var message = chat.messages.where(
                message =>
                    message._id.toString() === messageId.toString()
            );
            if(
                message 
                && !(message.seenBy.includes( userId ))
            ){
                message.seenBy.push( userId );
            }
        }

        chat.markModified("messages");
        chat.save(
            function (err) {
                if(err) {
                    console.error('ERROR: While Update!');
                    return res.status(500).json(
                        {
                            error: true,
                            message: "Internal server error"
                        }
                    );
                }
            }
        );

        return res.status(200).json(
            {
                error: false,
                message: "messages seen succesfully"
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

export default seeMessagesController;