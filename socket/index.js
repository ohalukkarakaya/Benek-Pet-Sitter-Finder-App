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
    !users.some( user => user.userId === userId ) 
    && users.push({ userId, socketId });
}

const getUser = ( userId ) => {
    return users.find( user => user.userId === userId );
}

const removeUser = ( socketId ) => {
    users = users.filter( user => user.socketId !== socketId )
}

io.on(
    "connection",
    ( socket ) => {
        console.log( "connection happen" );
        //when connect
        socket.on( "addUser", ( userId ) => { addUser( userId, socket.id ); } );

        //send message
        socket.on(
            "sendMessage",
            ( chatObject, receiverIdList ) => {
                for( let receiverUserId of [...new Set( receiverIdList )] ){
                    let user = getUser( receiverUserId );
                    if( user ){ 
                        io.to( user.socketId ).emit( "getMessage", chatObject ) 
                    }
                }
            }
        );

        //send message
        socket.on(
            "sendNotification",
            ( to, notificationObject ) => {
                let user = getUser( to );
                if( user ){
                    io.to(user.socketId).emit(
                        "getMessage",
                        notificationObject
                    )
                }
            }
        );

        //when disconnect
        socket.on( "disconnect", () => { removeUser( socket.id ); } );
    }
);