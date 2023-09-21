import Chat from "../../../models/Chat/Chat.js";
import User from "../../../models/User.js";

const createChatController = async (req, res) => {
    try{
        // gelen veriler
        let memberList = req.body.memberList;
        const chatDesc = req.body.chatDesc.toString()
        // gelen veriler eksikse
        if( !memberList ){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "MemberUserList is necessary"
                            }
                       );
        }

        // sohbeti oluşturan kullanıcının idsi
        const createrUserId = req.user._id.toString();

        // sohbeti oluşturan kullanıcının idsi olmadan sohbete dahil olacak
        // kullanıcıların id listesi
        const membersWithoutCreater = memberList.filter(
            memberUserId =>
                    memberUserId.toString() !== createrUserId
        );

        //sohbette sadece sohbeti açacak kullanıcı ekleniyorsa hata bas
        if( membersWithoutCreater.length <= 0 ){
            return res.status( 500 )
                      .json(
                            {
                                error: true,
                                message: "memberList must be a list"
                            }
                       );
        }

        // sohbetin üyesi bütün kullanıcıların aktif olup olmadığını kontrol et
        // eğer kullanıcı yoksa kullanıcıyı sohbetten sil ve listede, sohbeti
        // oluşturan kullanıcıyı engellemiş bir kullanıcı varsa o kullanıcıyı sohbete
        // ekleme
        for( let memberId of membersWithoutCreater ){
            const member = await User.findById( memberId.toString() );

            if( 
                !member
                || member.blockedUsers.includes( createrUserId )
            ){
                memberList = memberList.filter( userId => userId !== memberId.toString() );
            }      
        }

        // sohbeti oluşturan kullanıcı listede yoksa ekle
        const isCreatingUserInList = memberList.filter(
            memberUserId =>
                    memberUserId.toString() === createrUserId
        );
        if( !( isCreatingUserInList.length > 0 ) ){
            memberList.push( createrUserId );
        }

        // eklenen kullanıcı sayısı 5ten fazla ise hata döndür
        if( memberList.length > 5 ){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "Group chat reached to max user limit"
                            }
                       );
        }

        // aynı kullanıcılara sahip başka bir sohbet var mı kontrol
        // sorgusunu hazırla
        const aggregatePipeline = [
            {
              $match: {
                'members.userId': { $all: memberList },
              },
            },
        ];
          
        // aynı kullanıcılara sahip başka bir sohbet var mı kontrol et
        let chatWithSameMembers = await Chat.aggregate( aggregatePipeline );
        const areThereChatWithSameMembers = chatWithSameMembers.filter(
            chatObject =>
                chatObject.members
                          .filter(
                            member => !( member.leaveDate )
                          ).length === memberList.length
        )

        // eğer sadece aynı kullanıcılardan oluşan başka bir sohbet varsa 
        // zaten var olan sohbet objesinin idsini dön.
        if( 
            areThereChatWithSameMembers
            && areThereChatWithSameMembers.length > 0 
        ){
            return res.status( 200 )
                      .json(
                            {
                                error: false,
                                chatId: areThereChatWithSameMembers[0]._id.toString(),
                                message: "There is allready chat with same members",
                            }
                       );
        }

        // kullanıcı listesini oluştur
        const memberLisToAdd = [];
        for( let memberId of memberList ){
            memberLisToAdd.push(
                {
                    userId: memberId,
                    joinDate: Date.now()
                }
            );
        }

        // sohbet objesini oluştur ve kaydet
        await new Chat(
            {
              members: memberLisToAdd,
              chatDesc: chatDesc
            }
        ).save()
         .then(
            ( chat ) => {
            return res.status( 200 )
                      .json(
                            {
                                error: false,
                                chatId: chat._id.toString(),
                                message: "New chat created succesfully"
                            }
                       );
            }
        );
    }catch( err ){
        console.log( err );
        res.status( 500 )
           .json(
                {
                    error: true,
                    message: "Internal Server Error"
                }
            );
    }
}

export default createChatController;