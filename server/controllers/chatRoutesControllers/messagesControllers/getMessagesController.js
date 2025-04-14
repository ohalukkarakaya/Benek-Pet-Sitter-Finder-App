import Chat from "../../../models/Chat/Chat.js";
import User from "../../../models/User.js";
import getLightWeightUserInfoHelper from "../../../utils/getLightWeightUserInfoHelper.js";

const getMessagesController = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const LastItemId = req.params.lastItemId?.toString() || "null";
        const limit = parseInt(req.params.limit?.toString()) || 15;
        const chatId = req.params.chatId?.toString();

        if (!chatId) {
            return res.status(400).json({
                error: true,
                message: "missing param",
            });
        }

        const chat = await Chat.findById(chatId).lean();
        if (!chat) {
            return res.status(404).json({
                error: true,
                message: "chat not found",
            });
        }

        // Kullanıcı bilgilerini topla
        const userDataList = [];
        for (let member of chat.members) {
            if (!member.leaveDate) {
                const memberObject = await User.findById(member.userId.toString());
                if (!memberObject) {
                    return res.status(404).json({
                        error: true,
                        message: `user with the id: "${member.userId.toString()}" not found`,
                    });
                }
                const memberData = getLightWeightUserInfoHelper(memberObject);
                if (memberData) {
                    userDataList.push(memberData);
                }
            }
        }

        // Kullanıcının bu sohbette olup olmadığını kontrol et
        const usersChatInfo = chat.members.filter(
            (member) => member.userId.toString() === userId && !member.leaveDate
        );

        if (usersChatInfo.length <= 0) {
            return res.status(401).json({
                error: true,
                message: "UnAuthorized",
            });
        }

        const joinDate = usersChatInfo[0].joinDate;

        // Sohbetteki mesajlardan sadece kullanıcının katıldığı tarihten sonrakileri al
        const filteredMessages = chat.messages.filter((message) => {
            const sendDate = new Date(message.sendDate);
            return sendDate >= joinDate;
        });

        if (filteredMessages.length < 1) {
            return res.status(200).json({
                error: false,
                message: "chat is empty",
                totalMessageCount: 0,
                messages: [],
            });
        }

        // 1. Mesajları yeniye göre sırala
        const sortedMessages = filteredMessages.sort(
            (a, b) => b.sendDate.getTime() - a.sendDate.getTime()
        );

        // 2. LastItemId varsa index bul
        let startIndex = 0;
        if (LastItemId && LastItemId !== "null") {
            const lastIndex = sortedMessages.findIndex(
                (msg) => msg._id.toString() === LastItemId
            );
            startIndex = lastIndex >= 0 ? lastIndex + 1 : 0;
        }

        // 3. slice işlemi yap
        const paginatedMessages = sortedMessages.slice(startIndex, startIndex + limit);

        // 4. frontend düzgün görsün diye eskiye göre sırala
        const finalMessages = paginatedMessages.reverse();

        // seenBy kullanıcı bilgilerini ekle
        const seenByListUpdatedMessageList = finalMessages.map((message) => {
            message.senderUser = userDataList.find(
                (usr) => usr.userId === message.sendedUserId
            );

            const seenBy = message.seenBy.map((seenUserId) => {
                return userDataList.find((usr) => usr.userId === seenUserId) || null;
            });

            return { ...message, seenBy };
        });

        return res.status(200).json({
            error: false,
            message: "Messages listed succesfully",
            totalMessageCount: filteredMessages.length,
            messages: seenByListUpdatedMessageList,
        });
    } catch (err) {
        console.log("ERROR: getMessagesController - ", err);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
};

export default getMessagesController;