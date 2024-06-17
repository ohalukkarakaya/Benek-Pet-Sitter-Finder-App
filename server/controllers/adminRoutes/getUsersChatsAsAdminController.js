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
                        lastItemId !== 'null' ? { "_id": { $lt: mongoose.Types.ObjectId(lastItemId) } } : {},
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
                    lastMessage: { $arrayElemAt: ["$messages", -1] }
                }
            },
            { $sort: { "lastMessage.sendDate": -1 } },
            { $limit: limitValue }
        ];

        // // Chat objelerini hazırla ve filtrele ve say
        const chatCountPipeline = [...chatMatchPipeline, { $count: "totalChatCount" }];

        const [chats, chatCountResult] = await Promise.all([
            Chat.aggregate( chatMatchPipeline ),
            Chat.aggregate( chatCountPipeline )
        ]);

        // toplam chat sayısını al
        const totalChatCount = chatCountResult[0] ? chatCountResult[0].totalChatCount : 0;

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