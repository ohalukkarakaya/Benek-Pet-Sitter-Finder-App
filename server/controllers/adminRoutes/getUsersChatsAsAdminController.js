import Chat from "../../models/Chat/Chat.js";
import User from "../../models/User.js";

import mongoose from "mongoose";

const getUsersChatsAsAdminController = async (req, res) => {
    try{
        // gelen veriyi karşıla
        const evaluatingUser = req.params.userId.toString();
        const lastItemId = req.params.lastItemId.toString() || "null";
        const limitValue = parseInt( req.params.limit.toString() ) || 15;

        // sorguyu hazırla
        const chatMatchPipeline = [
            {
                $match: {
                    $and: [
                        { "members.userId": evaluatingUser },
                        { "members.leaveDate": { $exists: false } }
                    ]
                }
            },
            {
                $project: {
                    _id: 1,
                    members: 1,
                    chatStartDate: 1,
                    chatName: 1,
                    chatDesc: 1,
                    chatImageUrl: 1,
                    lastMessage: { $arrayElemAt: ["$messages", -1] },
                    unreadMessageCount: {
                        $size: {
                            $filter: {
                                input: "$messages",
                                as: "message",
                                cond: { $not: { $in: [evaluatingUser, "$$message.seenBy"] } }
                            }
                        }
                    },
                    totalMessageCount: { $size: "$messages" }
                }
            },
            {
                $addFields: {
                    sortDate: {
                        $cond: {
                            if: { $eq: ["$lastMessage", null] },
                            then: "$chatStartDate",
                            else: "$lastMessage.sendDate"
                        }
                    }
                }
            },
            { $sort: { sortDate: -1 } },
        ];

        // // Chat objelerini hazırla ve filtrele ve say
        const chatCountPipeline = chatMatchPipeline.filter(stage => !stage.$limit);
        chatCountPipeline.push({ $count: "totalChatCount" });

        let [chats, chatCountResult] = await Promise.all([
            Chat.aggregate( chatMatchPipeline ),
            Chat.aggregate( chatCountPipeline )
        ]);

        // toplam chat sayısını al
        const totalChatCount = chatCountResult[0] ? chatCountResult[0].totalChatCount : 0;

        if(lastItemId !== "null" && chats.length > 0) {
            const lastItemIndex = chats.findIndex(chat => chat._id.toString() === lastItemId);
            chats = chats.slice(lastItemIndex + 1);
        }

        if( chats.length > limitValue ){
            chats = chats.slice( 0, limitValue );
        }

        // kullanıcıya dönülecek sohbet üyelerinin verisini hazırla
        for( let chat of chats ){
            for( let member of chat.members ){
                let memberObject = await User.findById( member.userId );
                if( !memberObject || memberObject.leaveDate ){ break; }

                member.userId = memberObject._id.toString();
                member.username = memberObject.userName;
                member.isProfileImageDefault = memberObject.profileImg.isDefaultImg,
                member.profileImg = memberObject.profileImg.imgUrl;
            }
        }

        return res.status( 200 ).json({
            error: false,
            message: "list prepared succesfully",
            totalChatCount: totalChatCount,
            chats: chats,
        });
    }catch( err ){
        console.log( "ERROR: getUsersChatsAsAdminController - ", err );
        return res.status( 500 ).json({
            error: true,
            message: "Internal Server Error"
        });
    }
}

export default getUsersChatsAsAdminController;