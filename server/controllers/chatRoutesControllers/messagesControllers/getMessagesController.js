import Chat from "../../../models/Chat/Chat.js";
import User from "../../../models/User.js";
import getLightWeightUserInfoHelper from "../../../utils/getLightWeightUserInfoHelper.js";

const getMessagesController = async (req, res) => {
    try{
        // gelen veriyi karşıla
        const userId = req.user._id.toString();
        const skip = parseInt( req.params.skip.toString() ) || 0;
        const limit = parseInt( req.params.limit.toString() ) || 15;

        const chatId = req.params.chatId.toString();
        if( !chatId ){
            return res.status(400).json(
                {
                    error: true,
                    message: "missing param"
                }
            );
        }

        // chat objesini bul, yoksa hata dön
        const chat = await Chat.findById( chatId ).lean();
        if( !chat ){
            return res.status(404).json(
                {
                    error: true,
                    message: "chat not found"
                }
            );
        }

        // sohbet üyesi kullanıcıların verilerini hazırla
        const userDataList = [];
        for( let member of chat.members ){
            // sohbet üyesi kullanıcıyı bul
            if( !( member.leaveDate ) ){
                let memberObject = await User.findById( member.userId.toString() );
                if( !memberObject ){
                    return res.status( 404 )
                              .json(
                                    {
                                        error: true,
                                        message: `user with the id: "${member.userId.toString()}" not found`
                                    }
                               );
                }
                //kullanıcının verilerini filtrele
                let memberData = getLightWeightUserInfoHelper( memberObject );
                if( memberData ){
                    //veriyi listeye ekle
                    userDataList.push( memberData );
                }
            }
        }

        // istek atan kullanıcının sohbet üyesi olup olmadığını kontrol et
        const usersChatInfo = chat.members.filter(
            member =>
                member.userId.toString() === userId
                && !( member.leaveDate )
        );
        if( usersChatInfo.length <= 0 ){
            return res.status( 401 )
                      .json(
                            {
                                error: true,
                                message: "UnAuthorized"
                            }
                       );
        }

        // kullanıcının sohbete katılma tarihinden sonra gönderilen mesajları bul
        const joinDate = usersChatInfo[0].joinDate;
        const filteredMessages = chat.messages.filter(
            ( message ) =>
                Date( message.sendDate ) >= joinDate
        );
        // kullanıcı sohbete katıldıktan sonra gönderilmiş bir mesaj yoksa
        // chet boş mesajı dön
        if( filteredMessages.length < 1 ){
            return res.status( 200 )
                      .json(
                            {
                                error: false,
                                message: "chat is empty",
                                totalMessageCount: filteredMessages.length,
                                messages: []
                            }
                      );
        }

        // mesajları skip, limit değerine göre sayfalandırma sistemi için böl
        const slicedMessage = filteredMessages.slice( skip, skip + limit );
        if( slicedMessage.length < 1 ){
            return res.status( 200 )
                      .json(
                            {
                                error: false,
                                message: "chat is empty",
                                totalMessageCount: filteredMessages.length,
                                messages: []
                            }
                       );
        }

        // mesajları gönderilme tarihine göre sırala
        const sortedMessages = slicedMessage.sort(
            ( a, b ) =>
                a.sendDate.getTime() - b.sendDate.getTime()
        );
        // bir sebepten sıralanmış mesaj listesi boş ise liste boş mesajı dön
        if( sortedMessages.length < 1 ){
            return res.status( 200 )
                      .json(
                            {
                                error: false,
                                message: "chat is empty",
                                totalMessageCount: filteredMessages.length,
                                messages: []
                            }
                       );
        }

        // seenby listesini hazırla
        const seenByListUpdatedMessageList = sortedMessages.map(
            ( message ) => {
                const seenBy = message.seenBy.map(
                    ( userId ) => {
                        const user = userDataList.find( ( usr ) =>  usr.userId === userId );
                        return user ? user : null;
                    }
                );
            
                return { ...message, seenBy };
            }
        );

        return res.status( 200 )
                  .json(
                        {
                            error: false,
                            message: "Messages listed succesfully",
                            totalMessageCount: filteredMessages.length,
                            messages: seenByListUpdatedMessageList
                        }
                  );

    }catch( err ){
        console.log( "ERROR: getMessagesController - ", err );
        res.status( 500 )
           .json(
                {
                    error: true,
                    message: "Internal Server Error"
                }
            );
    }
}

export default getMessagesController;