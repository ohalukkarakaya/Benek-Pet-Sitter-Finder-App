import Chat from "../../models/Chat/Chat.js";
import User from "../../models/User.js";
import getLightWeightUserInfoHelper from "../../utils/getLightWeightUserInfoHelper.js";

const getUsersMessagesAsAdminController = async (req, res) => {
    try {
        const evaluatingUser = req.params.userId.toString();
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

        // Sohbet üyelerinin verilerini topla
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

        // Kullanıcının bu sohbete dahil olup olmadığını kontrol et
        const usersChatInfo = chat.members.filter(
            (member) => member.userId.toString() === evaluatingUser && !member.leaveDate
        );
        if (usersChatInfo.length <= 0) {
            return res.status(401).json({
                error: true,
                message: "UnAuthorized",
            });
        }

        const joinDate = usersChatInfo[0].joinDate;

        // Kullanıcının katıldığı tarihten sonraki mesajları filtrele
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

        // 1. Mesajları tarihe göre ters sırala (yeniden eskiye)
        const sortedMessages = filteredMessages.sort(
            (a, b) => b.sendDate.getTime() - a.sendDate.getTime()
        );

        // 2. LastItemId varsa onun index'ini bul
        let startIndex = 0;
        if (LastItemId && LastItemId !== "null") {
            const lastIndex = sortedMessages.findIndex(
                (msg) => msg._id.toString() === LastItemId
            );
            startIndex = lastIndex >= 0 ? lastIndex + 1 : 0;
        }

        // 3. Sayfalandırma (slice)
        const paginatedMessages = sortedMessages.slice(startIndex, startIndex + limit);

        // 4. Frontend için tekrar eski→yeni sırasına çevir
        const finalMessages = paginatedMessages.reverse();

        // 5. SeenBy listelerine user objesi ekle
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
        console.log("ERROR: getUsersMessagesAsAdminController - ", err);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
};

export default getUsersMessagesAsAdminController;