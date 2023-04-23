import Chat from "../../models/Chat.js";

const getChatsController = async (req, res) => {
    try{
        const userId = req.user._id.toString();
        const skipValue = parseInt( req.params.skip.toString() );
        const limitValue = parseInt( req.params.limit.toString() );
        Chat.aggregate(
          [
            // Önce, verilen userId'yi içeren chat objelerini filtreleyin.
            {
              $match: {
                "members.userId": userId
              }
            },
            // Sonra, son mesajı al
            {
                $project: {
                  _id: 1,
                  members: 1,
                  chatStartDate: 1,
                  chatName: 1,
                  chatDesc: 1,
                  chatImageUrl: 1,
                  lastMessage: { $arrayElemAt: [ "$messages", -1 ] }
                }
            },
            // En son olarak, chat objelerini en yeni lastMessage.sendDate tarihine göre sıralayın.
            {
              $sort: {
                "lastMessage.sendDate": -1
              }
            },
            // Skip ve limit değerlerine göre chat objelerini döndürün.
            {
              $skip: skipValue
            },
            {
              $limit: limitValue
            }
          ], 
          function(err, chats) {
            if ( err ){
              console.log(err);
              return res.status(500).json(
                {
                    error: true,
                    message: "Internal Server Error"
                }
              );
            }
            
            return res.status(200).json(
                {
                    error: false,
                    chats: chats,
                    message: "list prepared succesfully"
                }
            );
          }
        );
    }catch(err){
        console.log(err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default getChatsController;