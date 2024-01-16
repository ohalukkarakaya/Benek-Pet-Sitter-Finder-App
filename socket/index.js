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
let adminClients = [];

const addUser = ( userId, socketId ) => {
    !users.some( user => user.userId === userId ) 
    && users.push({ userId, socketId });
}
const getUser = ( userId ) => { return users.find( user => user.userId === userId ); }
const removeUser = ( socketId ) => { users = users.filter( user => user.socketId !== socketId ); }

const addAdminClient = ( clientId, socketId ) => {
    !adminClients.some( adminClient => adminClient.clientId === clientId )
    && adminClients.push({ clientId, socketId });
}
const getAddAdminClient = ( clientId ) => { return adminClients.find( client => client.clientId === clientId ); }
const removeAdminClient = ( socketId ) => { adminClients = adminClients.filter( adminClient => adminClient.socketId !== socketId ); }

io.on(
    "connection",
    ( socket ) => {
        //when connect
        socket.on( "addUser", ( userId ) => { addUser( userId, socket.id ); });

        //when admin client connects
        socket.on( "addAdminClient", ( clientId ) => {
            addAdminClient( clientId, socket.id );
         });

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
                    io.to(user.socketId).emit( "getMessage", notificationObject )
                }
            }
        );

        //send admin info to admin
        socket.on(
            "adminLogin",
            ( clientId, userInfoObject ) => {
                let client = getAddAdminClient( clientId );
                if( client ){
                    io.to( client.socketId ).emit( "getUserInfo", userInfoObject );
                }
            }
        )

        //when disconnect
        socket.on( 
            "disconnect", 
            () => { 
                removeUser( socket.id );
                removeAdminClient( socket.id );
            } 
        );
    }
);