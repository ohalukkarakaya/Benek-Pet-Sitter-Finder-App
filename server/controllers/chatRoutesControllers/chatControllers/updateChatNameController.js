import Chat from "../../../models/Chat.js";

const updateChatNameController = async (req, res) => {
    try{
        const userId = req.user._id.toString();
        const chatId = req.params.chatId.toString();
        const chatName = req.body.chatNme.toString();
        if( !chatId || !chatName ){
            return res.status(400).json(
                {
                    error: true,
                    message: "Missing params"
                }
            );
        }

        const chat = await Chat.findById( chatId );
        if( !chat ){
            return res.status(404).json(
                {
                    error: true,
                    message: "Chat Not Found"
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
                    message: "Un authorized"
                }
            );
        }

        chat.chatName = chatName;
        chat.markModified("chatName");
        chat.save(
            function (err) {
              if(err) {
                  console.error('ERROR: While Update chat name!');
              }
            }
        );

        return res.status(200).json(
            {
                error: false,
                message: "Chat name updated succesfully",
                chatId: chatId
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

export default updateChatNameController;