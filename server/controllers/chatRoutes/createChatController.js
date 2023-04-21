import Chat from "../../models/Chat.js";
import User from "../../models/User.js";

const createChatController = async (req, res) => {
    try{
        const memberList = req.body.memberList;
        if( !memberList ){
            return res.status(400).json(
                {
                    error: true,
                    message: "MemberUserList is necessary"
                }
            );
        }

        const createrUserId = req.user._id.toString();

        const membersWithoutCreater = memberList.filter(
            memberUserId =>
                    memberUserId.toString() === createrUserId
        );

        if( membersWithoutCreater.length <= 0 ){
            return res.status(500).json(
                {
                    error: true,
                    message: "memberList must be a list"
                }
            );
        }

        for( var memberId in membersWithoutCreater ){
            const member = await User.findById( memberId.toString() );
            const didMeberBlockedCreater = member.blockedUsers.where(
                blockedUserId =>
                        blockedUserId.toString() === createrUserId
            );

            if( !member || didMeberBlockedCreater ){
                return res.status(404).json(
                    {
                        error: true,
                        message: `User with id "${ memberId }" not found`
                    }
                );
            }        
        }

        const isCreatingUserInList = memberList.where(
            memberUserId =>
                    memberUserId.toString() === createrUserId
        );
        if( !isCreatingUserInList ){
            memberList.add( createrUserId );
        }

        if( memberList.length > 5 ){
            return res.status(400).json(
                {
                    error: true,
                    message: "Group chat reached to max user limit"
                }
            );
        }

        const areThereChatWithSameMembers = await Chat.find(
            {
            members: {
                $size: memberList.length,
                $all: memberList.map((userId) => ({ userId: userId }))
            }
            }
        );

        if( areThereChatWithSameMembers ){
            return res.status( 200 ).json(
                {
                    error: false,
                    chatId: areThereChatWithSameMembers._id.toString(),
                    message: "There is allready chat with same members",
                }
            );
        }

        const memberLisToAdd = [];

        for(var memberId in memberList ){
            memberLisToAdd.add(
                {
                    userId: memberId,
                    joinDate: Date.now()
                }
            );
        }

        await new Chat(
            {
            members: memberLisToAdd,
            chatDesc: req.body.chatDesc.toString()
            }
        ).save()
        .then(
            (chat) => {
            return res.status(200).json(
                {
                    error: false,
                    chatId: chat._id.toString(),
                    message: "New chat creates succesfully"
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

export default createChatController;