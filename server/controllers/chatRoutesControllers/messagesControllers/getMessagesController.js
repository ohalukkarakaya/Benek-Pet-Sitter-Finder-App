import Chat from "../../../models/Chat/Chat.js";
import User from "../../../models/User.js";

const getMessagesController = async (req, res) => {
    try{
        const userId = req.user._id.toString();
        const skip = parseInt( req.params.skip.toString() );
        const limit = parseInt( req.params.limit.toString() );

        const chatId = req.params.chatId.toString();
        if( !chatId ){
            return res.status(400).json(
                {
                    error: true,
                    message: "missing param"
                }
            );
        }

        if( !skip ){ skip = 0; }

        const chat = await Chat.findById( chatId );
        if( !chat ){
            return res.status(404).json(
                {
                    error: true,
                    message: "chat not found"
                }
            );
        }

        const userDataList = [];

        for( let member in chat.members ){
            let memberObject = await User.findById( member.userId.toString() );
            if( !memberObject ){
                return res.status(404).json(
                    {
                        error: true,
                        message: `user with the id: "${member.userId.toString()}" not found`
                    }
                );
            }

            let memberData = {
                userId: memberObject._id.toString(),
                username: memberObject.userName,
                profileImg: memberObject.profileImg.imgUrl
            }

            if( memberData ){
                userDataList.push( memberData );
            }
        }

        const usersChatInfo = chat.members.where(
            member =>
                member.userId.toString() === userId
        );
        if( !usersChatInfo ){
            return res.status(401).json(
                {
                    error: true,
                    message: "UnAuthorized"
                }
            );
        }

        const joinDate = usersChatInfo.joinDate;
        const filteredMessages = chat.messages.filter(
            ( message ) =>
                message.sendDate >= joinDate
        );
        if( filteredMessages.length < 1 ){
            return res.status(200).json(
                {
                    error: false,
                    message: "chat is empty",
                    totalMessageCount: filteredMessages.length,
                    messages: []
                }
            );
        }

        const slicedMessage = filteredMessages.slice(
            skip,
            skip + limit
        );
        if( slicedMessage.length < 1 ){
            return res.status(200).json(
                {
                    error: false,
                    message: "chat is empty",
                    totalMessageCount: filteredMessages.length,
                    messages: []
                }
            );
        }

        const sortedMessages = slicedMessage.sort(
            ( a, b ) =>
                a.sendDate.getTime() - b.sendDate.getTime()
        );
        if( sortedMessages.length < 1 ){
            return res.status(200).json(
                {
                    error: false,
                    message: "chat is empty",
                    totalMessageCount: filteredMessages.length,
                    messages: []
                }
            );
        }

        const seenByListUpdatedMessageList = sortedMessages.map(
            ( message ) => {
                const seenBy = message.seenBy.map(
                    ( userId ) => {
                        const user = userDataList.find(
                            ( u ) => 
                                u.userId === userId
                        );
                        return user ? user : null;
                    }
                );
            
                return { ...message, seenBy };
            }
        );

        return res.status(200).json(
            {
                error: false,
                message: "Messages listed succesfully",
                totalMessageCount: filteredMessages.length,
                messages: seenByListUpdatedMessageList
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

export default getMessagesController;