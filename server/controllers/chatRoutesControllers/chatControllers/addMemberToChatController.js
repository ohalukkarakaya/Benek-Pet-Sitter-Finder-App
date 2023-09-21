import Chat from "../../../models/Chat/Chat.js";
import User from "../../../models/User.js";

const addMemberToChatController = async (req, res) => {
    try{
        // gelen parametreler
        const chatId = req.params.chatId.toString(); 
        const memberToAdd = req.params.userId.toString();

        //eğer eksik veri ile istek atıldıysa
        if( !memberToAdd || !chatId ){
            return res.status(400).json(
                {
                    error: true,
                    message: "missing params"
                }
            );
        }

        // kullanıcının ekleneceği chat objesini bul
        const chat = await Chat.findById( chatId.toString() );
        if( !chat ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "chat not found"
                            }
                       );
        }

        //kullanıcı zaten chat objesinde varsa ve ayrılmamışsa
        const isUserTryingToAddAlreadyMember = chat.members.filter(
            member =>
                member.userId.toString() === memberToAdd
                && !( member.leaveDate )
        ).length > 0;

        //istek atan kullanıcı sohbetin üyesimi?
        const isUserMember = chat.members.filter(
            member =>
                member.userId.toString() === req.user._id.toString()
                && !( member.leaveDate )
        ).length > 0;

        // eğer istek atan kullanıcı sohbetin üyesi değilse ya da 
        //eklenmeye çalışılan kullanıcı zaten sohbetin üyesiyse
        if( !isUserMember  || isUserTryingToAddAlreadyMember ){
            return res.status( 401 )
                      .json(
                            {
                                error: true,
                                message: "You are not member or this chat or user which you are trying to add is already member"
                            }
                       );
        }

        // eğer yeni katılan kullanıcı daha önce aynı sohbete katılıp sonra
        // ayrıldıysa ve biz eski katıldığı ve ayrıldığı dönemdeki veriyi
        // silmek istiyorsak aşağıdaki kod bloğunu yorum satırından kaldırmalıyız...

        // şuan için yorum satırında çünkü kullanıcı daha önceden dahil olduysa ve birşeyler
        // yazdıysa, o çıktıktan sonra yine diğer kullanıcılar yazışmaya devam ettiyse ve
        // daha sonra geri geldiyse aradaki mesajları göstermeden sadece var olduğu dönem
        // yazılan mesajları eksiksiz göstermek için her join ve leave verisine ihtiyacımız var

        // const didUserToAddLeftChatInThePast = chat.members.filter(
        //     member =>
        //         member.userId.toString() === memberToAdd
        //         && member.leaveDate 
        // )

        // if( 
        //     didUserToAddLeftChatInThePast
        //     && didUserToAddLeftChatInThePast.length > 0
        // ){
        //     chat.members = chat.members(
        //         member =>
        //             member.userId.toString() !== memberToAdd
        //     );
        // }

        //sadece üye kullanıcı idlerinden oluşan bir liste al ve eklenecek kullanıcının
        //idsinide bu listeye ekle
        const memberList = chat.members.map( member => member.userId.toString() );
        memberList.push( memberToAdd );

        if( !memberList || memberList.length <= 1 ){
            return res.status( 500 )
                      .json(
                            {
                                error: true,
                                message: "Internal Server Error"
                            }
                       );
        }

        //istek atan kullanıcının idsi
        const addingUserId = req.user._id.toString();

        // istek atan kullanıcının idsi olmadan sohbet üyesi kullanıcıların
        // idlerinin listesi
        const membersWithoutAdder = memberList.filter(
            memberUserId =>
                    memberUserId.toString() === addingUserId
        );

        // sohbetin üyesi bütün kullanıcıların aktif olup olmadığını kontrol et
        // eğer kullanıcı yoksa kullanıcıyı sohbetten sil ve sohbette kullanıcıyı
        // engellemiş bir kullanıcı varsa kullanıcının sohbete alınmasını engelle
        for( let memberId of membersWithoutAdder ){
            const member = await User.findById( memberId.toString() );

            if( !member ){
                memberList = memberList.filter( userId => userId !== memberId.toString() );
                chat.members = chat.members.filter( member => member.userId !== memberId.toString() );
                chat.markModified( "members" )
            }  
            
            if( member.blockedUsers.includes( addingUserId )  ){
                return res.status( 404 )
                          .json(
                                {
                                    error: true,
                                    message: `There is users who blocked "${ addingUserId }" in this chat`
                                }
                           );
            }
        }

        // eklenmeye çalışılan kullanıcının idsi id listesinde var mı diye kontrol et
        // yoksa ekle
        const isAddingUserInList = memberList.filter(
            memberUserId =>
                    memberUserId.toString() === memberToAdd
        );
        if( !isAddingUserInList ){
            memberList.push( memberToAdd );
        }

        // sohbetteki üye sayısı yeni kullanıcıyla birlikte 5 ten fazlaysa
        // kullanıcının eklenmesine izin verme
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
        const chatWithSameMembers = await Chat.aggregate( aggregatePipeline );
        const areThereChatWithSameMembers = chatWithSameMembers.filter(
            chatObject =>
                chatObject.members
                          .filter(
                            member => !( member.leaveDate )
                          ).length === memberList.length
        )

        // eğer sadece aynı kullanıcılardan oluşan başka bir sohbet varsa kullanıcıyı ekleme
        // zaten var olan sohbet objesinin idsini dön. Fakat silinmiş bir kullanıcı varsa eski
        // sohbetten onun idsi kaldırılacağı için chat objesini kaydet
        if( 
            areThereChatWithSameMembers
            && areThereChatWithSameMembers.length > 0 
        ){
            await chat.save();
            return res.status( 200 )
                      .json(
                            {
                                error: false,
                                chatId: areThereChatWithSameMembers[0]._id.toString(),
                                message: "There is allready chat with same members",
                            }
                       );
        }

        // yeni kullanıcıyı ekle ve chat objesini kaydet
        chat.members.push(
            {
                userId: memberToAdd
            }
        );
        chat.markModified("members");
        chat.save()
            .then(
                ( chat ) => {
                    return res.status( 200 )
                              .json(
                                    {
                                        error: false,
                                        chatId: chat._id.toString(),
                                        message: "New user added succesfully"
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

export default addMemberToChatController;