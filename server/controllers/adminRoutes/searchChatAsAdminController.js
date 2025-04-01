import Chat from "../../models/Chat/Chat.js";
import User from "../../models/User.js";
import getLightWeightUserInfoHelper from "../../utils/getLightWeightUserInfoHelper.js";

const searchChatAsAdminController = async (req, res) => {
    try {
        // gelen veriyi karşıla
        const evaluatedUser = req.params.userId.toString();
        const searchValue = req.params.searchText.toString();
        if (!searchValue) {
            return res.status(400).json({
                error: true,
                message: "missing params"
            });
        }

        const chats = await Chat.find({
            "members.userId": evaluatedUser,
            "members.leaveDate": null,
        }).lean();

        let matchingChats = [];
        for( let chat of chats ){
            const chatData = chat;

            const members = chatData.members.filter(
                member =>
                    member.userId !== req.user._id.toString()
                    && !( member.leaveDate )
            )
            // Kullanıcı adlarını ve sohbet adını küçük harfe dönüştürüp arama yap
            const userIdies = members.map(
                ( member ) =>
                    member.userId
            );

            let didUserMatched
            for( let memberId of userIdies ){
                const member = await User.findById( memberId );
                if( !memberId ){ break; }

                const searchOnUserName = member.userName.toLowerCase().includes( searchValue.toLowerCase() );
                const searchOnFirstName = member.identity.firstName.toLowerCase().includes( searchValue.toLowerCase() );
                const searchOnMiddleName = member.identity.middleName
                    ? member.identity.middleName.toLowerCase().includes( searchValue.toLowerCase() )
                    : false;
                const searchOnLastName = member.identity.lastName.toLowerCase().includes( searchValue.toLowerCase() );

                if(
                    searchOnUserName
                    || searchOnFirstName
                    || searchOnMiddleName
                    || searchOnLastName
                ){
                    matchingChats.push( chatData );
                    didUserMatched = true;
                    break;
                }
            }
            if( didUserMatched ){ break; }

            const chatName = chatData.chatName ? chatData.chatName.toLowerCase() : "";
            const chatDesc = chatData.chatDesc ? chatData.chatDesc.toLowerCase() : "";

            // Kullanıcı adları, sohbet adı ve açıklama içinde arama yapın
            if (
                chatName.includes( searchValue )
                || chatDesc.includes( searchValue )
            ) {
                matchingChats.push( chatData );
                break;
            }

            for( let message of chat.messages ){
                if(
                    message.message
                    && message.message.toLowerCase().includes( searchValue.toLowerCase() )
                ){
                    matchingChats.push( chatData );
                    break;
                }
            }
        }

        if( matchingChats.length <= 0 ){
            return res.status( 404 )
                .json(
                    {
                        error: true,
                        message: "message not found"
                    }
                );
        }

        for( let chat of matchingChats ){
            // prepare profile info of chat members
            let membersList = [];
            for( let member of chat.members ){
                let userObject = await User.findById( member.userId.toString() );
                if( !userObject ){
                    console.log( "user not found" );
                    break;
                }

                let userInfo = getLightWeightUserInfoHelper( userObject );
                userInfo.joinDate = member.joinDate;
                userInfo.leaveDate = member.leaveDate;
                membersList.push( userInfo );
            }

            delete chat.members
            chat.members = membersList;

            // prepare last message
            let lastMessage = chat.messages[ chat.messages.length - 1 ];
            let totalMessageCount = chat.messages.length;

            delete chat.messages;
            chat.lastMessage = lastMessage;
            chat.totalMessageCount = totalMessageCount;

            // prepare message seenBy
            let seenUsersList = [];

            if(
                chat.lastMessage
                && chat.lastMessage.seenBy
                && chat.lastMessage.seenBy.length > 0
            ){
                for(
                    let seenUserId
                    of chat.lastMessage.seenBy
                    ){
                    let userObject = await User.findById( seenUserId.toString() );
                    if( !userObject ){
                        console.log( "user not found" );
                        break;
                    }

                    let seenUserData = getLightWeightUserInfoHelper( userObject );
                    seenUsersList.push( seenUserData );
                }
            }

            if(
                seenUsersList
                && chat.seenBy
                && seenUsersList.length === chat.seenBy.length
            ){
                delete lastMessage.seenBy
                lastMessage.seenBy = seenUsersList
            }
        }

        return res.status( 200 )
            .json(
                {
                    error: false,
                    message: "Chat Searched",
                    chats: matchingChats
                }
            );

    }catch( err ){
        console.log( err );
        return res.status( 500 )
            .json(
                {
                    error: true,
                    message: "Internal Server Error"
                }
            );
    }
}

export default searchChatAsAdminController;