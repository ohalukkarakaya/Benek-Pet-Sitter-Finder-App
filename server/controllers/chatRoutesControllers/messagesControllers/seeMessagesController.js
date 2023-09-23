import Chat from "../../../models/Chat/Chat.js";

const seeMessagesController = async (req, res) => {
    try{
        // gelen veriyi karşıla
        const userId = req.user._id.toString();
        const chatId = req.params.chatId.toString();
        const messageIdsList = [...new Set( req.body.messagesIdsList )];
        // eksik veri varsa hata dön
        if( !chatId || !messageIdsList ){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "Missing param"
                            }
                       );
        }

        // chat objesini bul, yoksa hata dön
        const chat = await Chat.findById( chatId );
        if( !chat ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "Chat not found"
                            }
                      );
        }

        // istek atan kullanıcının sohbete üye olup
        // olmadığını kontrol et, eğer değilse hata dön
        const isUserMember = chat.members.filter(
            member =>
                member.userId.toString() === userId
                && !( member.leaveDate )
        ).length > 0;
        if( !isUserMember ){
            return res.status( 401 )
                      .json(
                            {
                                error: true,
                                message: "You can2t see those messages"
                            }
                       );
        }

        // listede idsi bulunan her mesajı bul,
        // mesaj varsa ve kullanıcı zaten mesajı görmediyse
        // kullanıcı idsini mesajı görenler listesine ekle 
        for( let messageId of messageIdsList ){
            var message = chat.messages.filter(
                message =>
                    message._id.toString() === messageId.toString()
            )[0];
            if(
                message 
                && !( message.seenBy.includes( userId ) )
            ){
                message.seenBy.push( userId );
            }
        }

        chat.markModified( "messages" );
        chat.save(
            function ( err ){
                if( err ){
                    console.error( 'ERROR: While Update!' );
                    return res.status( 500 )
                              .json(
                                    {
                                        error: true,
                                        message: "Internal server error"
                                    }
                               );
                }
            }
        );

        return res.status( 200 )
                  .json(
                        {
                            error: false,
                            message: "messages seen succesfully"
                        }
                   );
    }catch( err ){
        console.log( "ERROR: seeMessagesController - ", err );
        return res.status( 500 )
           .json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default seeMessagesController;