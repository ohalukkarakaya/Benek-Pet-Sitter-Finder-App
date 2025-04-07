import Chat from "../../../models/Chat/Chat.js";
import deleteFileHelper from "../../../utils/fileHelpers/deleteFileHelper.js";
import io from "socket.io-client";
import dotenv from "dotenv";

dotenv.config();

const socket = io( process.env.SOCKET_URL );

const leaveChatController = async (req, res) => {
    try {
        const chatId = req.params.chatId?.toString();

        if (!chatId) {
            return res.status(400).json({
                error: true,
                message: "missing params",
            });
        }

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({
                error: true,
                message: "chat not found",
            });
        }

        const isUserMember = chat.members.some(
            (member) =>
                member.userId === req.user._id.toString() && !member.leaveDate
        );

        if (!isUserMember) {
            return res.status(401).json({
                error: true,
                message: "You are not member",
            });
        }


        const leavingMember = chat.members.find(
            (member) => member.userId === req.user._id.toString()
        );
        leavingMember.leaveDate = Date.now();

        const remainingActiveMembers = chat.members.filter(
            (member) =>
                member.userId !== req.user._id.toString() && !member.leaveDate
        );

        // 🔔 Diğer üyelere ayrılan kişiyi bildir
        socket.emit(
            "chatMemberLeaved",
            {
                chatId,
                leavedUserId: req.user._id.toString(),
                remainingActiveMembers,
            }
        );

        if (remainingActiveMembers.length < 1) {
            const deleteAssets = await deleteFileHelper(`chatAssets/${chat._id}`);
            if (deleteAssets.error) {
                return res.status(500).json({
                    error: true,
                    message: "Failed to delete assets",
                });
            }

            await chat.deleteOne();
            return res.status(200).json({
                error: false,
                message: "Chat deleted after leaving (last member or alone)",
            });
        }

        // Aksi halde sadece leaveDate güncellenmiş haliyle kaydet
        chat.markModified("members");
        await chat.save();

        return res.status(200).json({
            error: false,
            message: "Left chat successfully",
        });

    } catch (err) {
        console.error("Error in leaveChatController:", err);
        res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
};

export default leaveChatController;