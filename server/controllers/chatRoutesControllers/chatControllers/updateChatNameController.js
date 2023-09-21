import Chat from "../../../models/Chat/Chat.js";

const updateChatNameController = async (req, res) => {
    try{
        // gelen veriyi karşıla eksik veri varsa hata dön
        const userId = req.user._id.toString(); 
        const chatId = req.params.chatId.toString();
        const chatName = req.body.chatNme.toString();
        if( !chatId || !chatName ){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "Missing params"
                            }
                       );
        }

        // sohbet objesini bul yoksa hata dön
        const chat = await Chat.findById( chatId );
        if( !chat ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "Chat Not Found"
                            }
                       );
        }

        // isteği gönderen kullanıcının sohbet üyesi olup olmadığını kontrol et
        // sohbet üyesi değilse hata dön 
        const isUserMember = chat.members.filter(
            member =>
                member.userId.toString === userId
                && !( member.leaveDate )
        );
        if( isUserMember.length <= 0 ){
            return res.status( 401 )
                      .json(
                            {
                                error: true,
                                message: "Un authorized"
                            }
                       );
        }

        // yeni sohbet ismini chat objesine yaz ve chat objesini kaydet
        chat.chatName = chatName;
        chat.markModified( "chatName" );
        chat.save(
            function ( err ){
              if( err ) {
                  console.error('ERROR: While Update chat name!');
              }
            }
        );

        return res.status( 200 )
                  .json(
                        {
                            error: false,
                            message: "Chat name updated succesfully",
                            chatId: chatId
                        }
                   );
    }catch( err ){
        console.log( err );
        return res.status( 500 )
                  .json(
                        {
                            error: true,
                            message: "Internal Server Error"
                        }
                   );
    }
}

export default updateChatNameController;