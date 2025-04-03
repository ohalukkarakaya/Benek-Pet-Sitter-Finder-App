import Chat from "../../../models/Chat/Chat.js";
import User from "../../../models/User.js";
import dotenv from "dotenv";
import io from "socket.io-client";
import getLightWeightUserInfoHelper from "../../../utils/getLightWeightUserInfoHelper.js";

dotenv.config();

const socket = io( process.env.SOCKET_URL );

const addMembersToChatController = async (req, res) => {
    try {
        const chatId = req.params.chatId?.toString();
        const membersToAdd = req.body.memberList;

        if (!chatId || !Array.isArray(membersToAdd) || membersToAdd.length === 0) {
            return res.status(400).json({
                error: true,
                message: "Missing chatId or memberList",
            });
        }

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({
                error: true,
                message: "Chat not found",
            });
        }

        const addingUserId = req.user._id.toString();

        const isUserMember = chat.members.some(
            (member) =>
                member.userId.toString() === addingUserId && !member.leaveDate
        );

        if (!isUserMember) {
            return res.status(401).json({
                error: true,
                message: "You are not a member of this chat",
            });
        }

        // Yeni eklenecek kullanıcıları ayıkla (hala üye olmayanlar)
        const activeMemberIds = chat.members
            .filter((m) => !m.leaveDate)
            .map((m) => m.userId.toString());

        let newValidMembers = [];

        for (const memberToAdd of membersToAdd) {
            const memberId = memberToAdd.toString();

            // eğer zaten aktif üye ise geç
            if (activeMemberIds.includes(memberId)) continue;

            // Engellenmiş mi kontrolü
            const memberUser = await User.findById(memberId);
            if (!memberUser) continue;

            if (memberUser.blockedUsers.includes(addingUserId)) {
                return res.status(403).json({
                    error: true,
                    message: `User "${memberId}" has blocked "${addingUserId}"`,
                });
            }

            // Her şey uygunsa eklenmeye uygun
            newValidMembers.push(memberId);
        }

        // Aktif üyeleri ve yeni eklenecekleri birleştir
        const totalMemberList = [...new Set([...activeMemberIds, ...newValidMembers])];

        if (totalMemberList.length > 5) {
            return res.status(400).json({
                error: true,
                message: "Group chat reached max user limit",
            });
        }

        // Aynı kullanıcılarla daha önce bir sohbet var mı kontrol et
        const chatWithSameMembers = await Chat.aggregate([
            {
                $match: {
                    "members.userId": { $all: totalMemberList },
                },
            },
        ]);

        const areThereSame = chatWithSameMembers.filter(
            (chatObj) =>
                chatObj.members.filter((m) => !m.leaveDate).length === totalMemberList.length
        );

        if (areThereSame.length > 0) {
            await chat.save();
            return res.status(200).json({
                error: false,
                chatId: areThereSame[0]._id.toString(),
                message: "There is already a chat with the same members",
            });
        }

        // Tüm geçerli kullanıcıları üyeler listesine ekle
        for (const memberId of newValidMembers) {
            chat.members.push({ userId: memberId });
        }

        let chatToSend = JSON.parse(JSON.stringify(chat));

        chat.markModified("members");
        await chat.save();

        for (let i = 0; i < chatToSend.members.length; i++) {
            const member = chatToSend.members[i];

            const user = await User.findById(member.userId);
            if (!user) continue;

            let userInfo = await getLightWeightUserInfoHelper(user);
            if (!userInfo) continue;

            userInfo.joinDate = member.joinDate;

            chatToSend.members[i] = userInfo; // artık safe
        }

// Emit et
        socket.emit(
            "sendMessage",
            chatToSend,
            chatToSend.members.filter((m) => m.userId?.toString?.() !== addingUserId),
        );

        return res.status(200).json({
            error: false,
            chatId: chat._id.toString(),
            message: `${newValidMembers.length} user(s) added successfully`,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
};

export default addMembersToChatController;