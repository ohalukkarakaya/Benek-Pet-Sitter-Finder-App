import Chat from "../../../models/Chat.js";
import User from "../../../models/User.js";

const searchChatController = async (req, res) => {
    try{
        const userId = req.user._id.toString();
        const searchValue = req.params.searchValue.toString();
        if( !searchValue ){
            return res.status(400).json(
                {
                    error: true,
                    message: "missing params"
                }
            );
        }

        // members alanındaki kullanıcıların userId'lerinin alınması
        const userIds = await Chat.distinct(
            "members.userId", 
            { 
                "members.userId": {
                     $ne: userId 
                } 
            }
        );

        // Chat isimlerinde ve açıklamalarında arama yapılması
        const chatsByNameAndDesc = await Chat.find(
            {
                "members.userId": { 
                    $in: userIds 
                },
                $or: [
                    { 
                        chatName: { 
                            $regex: searchValue, 
                            $options: "i" 
                        } 
                    },
                    { 
                        chatDesc: { 
                            $regex: searchValue, 
                            $options: "i" 
                        } 
                    }
                ]
            }
        );

        // Users koleksiyonundan arama yapılacak kullanıcıların seçimi
        const users = await User.find(
            { 
                userName: { 
                    $regex: searchValue, 
                    $options: "i" 
                } 
            }
        );

        // Members alanındaki kullanıcıların idlerine göre filtrelenmesi
        const userIdsByUserName = users.map(
                                          user => 
                                            user._id
                                        );

        // UserName'de arama yapılması
        const chatsByUserName = await Chat.find(
            {
                "members.userId": { 
                    $in: userIdsByUserName 
                },
                "members.userId": { 
                    $in: userIds 
                }
            }
        );

        // İki listeyi birleştir
        const allChats = chatsByNameAndDesc.concat( chatsByUserName );

        // Tekrar edenleri kaldır
        const uniqueChats = [...new Set(allChats)];

        uniqueChats.forEach(
            ( chat ) => {
                //prepare profile info of chat members

                chat.members.forEach(
                    ( member ) => {
                        let userObject = await User.findById( member.userId.toString() );
                        if( !userObject ){ 
                            console.log("user not found"); 
                        }

                        member.username = userObject.userName;
                        member.profileImg = userObject.profileImg.imgUrl;
                    }
                );

                //prepare last message
                let lastMessage = chat.messages[ chat.messages.length - 1 ];
                
                delete chat.messages;
                chat.lastMessage = lastMessage;
                
                //prepare message seenBy
                let seenUsersList = [];

                chat.lastMessage.seenBy.forEach(
                    ( seenUserId ) => {
                        let userObject = await User.findById( seenUserId.toString() );
                        if( !userObject ){ 
                            console.log("user not found"); 
                        }

                        let seenUserData = {
                            userId: userData._id.toString(),
                            username: userData.userName,
                            profileImg: userData.profileImg.imgUrl
                        }

                        if( seenUserData ){
                            seenUsersList.push( seenUserData );
                        }
                    }
                );

                if( seenUsersList.length === chat.seenBy.length ){
                    messageToSend.seenBy = seenUsersList
                }
            }
        );

        if( !uniqueChats ){
            return res.status(404).json(
                {
                    error: "true",
                    message: "messsage not found"
                }
            );
        }

        return res.status(200).json(
            {
                error: true,
                message: "Chat Searched",
                chats: uniqueChats
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

export default searchChatController;