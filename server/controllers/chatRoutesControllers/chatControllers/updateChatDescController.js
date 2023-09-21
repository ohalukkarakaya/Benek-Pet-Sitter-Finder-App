import Chat from "../../../models/Chat/Chat.js";

const updateChatDescController = async (req, res) => {
    try{
        // gelen veriyi karşıla eksik veri varsa hata dön
        const userId = req.user._id.toString()
        const chatId = req.params.chatId.toString();
        const chatDesc = req.body.chatDesc.toString();
        if( !chatId || !chatDesc ){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "Missing params"
                            }
                       );
        }

        // chat objesini bul yoksa hata dön
        const chat = await Chat.findById( chatId );
        if( !chat ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "chay not found"
                            }
                       );
        }

        // istek atan kullanıcının sohbet üyesi olup olmadığını 
        // kontrol et değilse hata dön
        const isUserMember = chat.members.filter(
            member =>
                member.userId.toString() === userId
                && !( member.leaveDate )
        );
        if( isUserMember.length <= 0 ){
            return res.status( 401 )
                      .json(
                            {
                                error: true,
                                message: "Un Authorized"
                            } 
                       );
        }

        // yeni sohbet açıklamasını chat objesine yaz ve chat objesini
        // kaydet
        chat.chatDesc = chatDesc;
        chat.markModified( "chatDesc" );
        chat.save(
            function ( err ) {
                if( err ) {
                    console.error('ERROR: While Update chat desc!');
                }
              }
        );

        return res.status( 200 )
                  .json(
                        {
                            error: false,
                            mesage: "chat desc updated succesfully",
                            chatId: chatId
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

export default updateChatDescController;