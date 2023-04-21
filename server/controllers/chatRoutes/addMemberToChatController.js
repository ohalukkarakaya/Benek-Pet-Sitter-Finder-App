import Chat from "../../models/Chat";

const addMemberToChatController = async (req, res) => {
    try{
        const chatId = req.params.chatId.toString();
        const memberToAdd = req.params.userId.toString();
        if( !memberToAdd || !chatId ){
            return res.status(400).json(
                {
                    error: true,
                    message: "missing params"
                }
            );
        }

        const chat = await Chat.findById( chatId.toString() );
        if( !chat ){
            return res.status(404).json(
                {
                    error: true,
                    message: "chat not found"
                }
            );
        }

        const isUserTryingToAddAlreadyMember = chat.members.where(
            member =>
                member.userId.toString() === memberToAdd
        );

        const isUserMember = chat.members.where(
            member =>
                member.userId.toString() === req.user._id.toString()
        );

        if( !isUserMember || isUserTryingToAddAlreadyMember ){
            return res.status(401).json(
                {
                    error: true,
                    message: "you are not allowed to add this member to this chat"
                }
            );
        }

        const memberList = chat.members.map( member => member.userId.toString() );
        memberList.add( memberToAdd );

        if( !memberList || memberList.length <= 1 ){
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal Server Error"
                }
            );
        }

        const addingUserId = req.user._id.toString();

        const membersWithoutAdder = memberList.filter(
            memberUserId =>
                    memberUserId.toString() === addingUserId
        );

        if( membersWithoutCreater.length <= 0 ){
            return res.status(500).json(
                {
                    error: true,
                    message: "memberList must be a list"
                }
            );
        }

        for( var memberId in membersWithoutAdder ){
            const member = await User.findById( memberId.toString() );
            const didMeberBlockedCreater = member.blockedUsers.where(
                blockedUserId =>
                        blockedUserId.toString() === addingUserId
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
                    $all: memberList.map( ( userId ) => ({ userId: userId }) ) //işe yaramzsa contains denenecek
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

        chat.members.add(
            {
                userId: memberToAdd
            }
        );
        chat.markModified("members");
        chat.save()
        .then(
            (chat) => {
            return res.status(200).json(
                {
                    error: false,
                    chatId: chat._id.toString(),
                    message: "New user added succesfully"
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

export default addMemberToChatController;