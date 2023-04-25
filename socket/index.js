// ____________________________________________________________________________________________________
// |                                                                                                  |                            
// |                                                                                                  |                            
// |                                                                                  -::.            |                            
// |                                                                              ..-*.               |                            
// |                                                                    .=  .:...  :* .=              |                            
// |                                                                  .+#::.     .:-::=               |                            
// |                                                      .=     ::::=#.     .: :.=#--..              |                            
// |                    :                       .:       -*:::::.   :=. : :-.:%-  #     ::::          |                            
// |                  :+.     -             .===::*-..:=%=:  .::. . -::+*:*:                ::.       |                           
// |                :*:     ::           .--:    #@:.:-+=  :*--%:.  +-  :                     .=      |                           
// |              .+=    ::.            +=.    :#%. :.=- .:%-=+=                               :-     |
// |            .+#-:--*+.            .+.    .+-+ :: :+..  :.                                 :-      |                            
// |        ..:=%-:::.    ..:.       :=     == +=:   ..                                   ...:        |                            
// |        :=+:.            :: :.  :#    --                                         .....            |                            
// |       .+-                =     .=-:::                                   .......                  |                            
// |      =-                 .+                      .-==---.      .........                          |                            
// |    -=            :    .=+                      .#=:::........                                    |                            
// |                  :::--:                                                                          |                            
// |                                                                                                  |                            
// |                                                                                                  |
// |__ Cumhuriyet Fazilettir! ________________________________________________________________________|


const io = require("socket.io")(
    8900,
    {
        cors:{
            origin: '*'
        }
    }
);

let users = [];

const addUser = ( userId, socketId ) => {
    !users.some(
        user => 
            user.userId === userId
    ) && users.psush(
        {
            userId,
            socketId
        }
    );
}

const getUser = ( userId ) => {
    return users.find(
        user =>
            user.userId === userId
    );
}

const removeUser = ( socketId ) => {
    users = users.filter(
        user =>
            user.socketId !== socketId
    )
}

io.on(
    "connection",
    ( socket ) => {

        //when connect
        socket.on(
            "addUser",
            ( userId ) => {
                addUser( userId, socket.id );
            }
        );

        //send message
        socket.on(
            "sendMessage",
            ( chatObject, receiverIdList ) => {
                for( var receiverUserId in [...new Set( receiverIdList )] ){
                    let user = getUser( receiverUserId );
                    if( user ){
                        io.to(user.socketId).emit(
                            "getMessage",
                             chatObject
                        )
                    }
                }
            }
        );

        //when disconnect
        socket.on(
            "disconnect",
            () => {
                removeUser( socket.id );
            }
        );

    }
);