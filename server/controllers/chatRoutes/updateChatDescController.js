import Chat from "../../models/Chat.js";

const updateChatDescController = async (req, res) => {
    try{
        const userId = req.user._id.toString()
        const chatId = req.params.chatId.toString();
        const chatDesc = req.body.chatDesc.toString();
        if( !chatId || !chatDesc ){
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
                    message: "chay not found"
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
                message: "Un Authorized"
               } 
            );
        }

        chat.chatDesc = chatDesc;
        chat.markModified("chatDesc");
        chat.save(
            function (err) {
                if(err) {
                    console.error('ERROR: While Update chat desc!');
                }
              }
        );

        return res.status(200).json(
            {
                error: true,
                mesage: "chat desc updated succesfully"
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

export default updateChatDescController;