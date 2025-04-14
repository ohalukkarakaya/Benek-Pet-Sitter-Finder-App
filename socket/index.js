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


const io = require("socket.io")(8900, {cors:{ origin: '*' } });

let users = [];
let adminClients = [];
let evaluators = [];

// User Operations
const addUser = ( userId, socketId ) => { !users.some( user => user.userId === userId ) && users.push({ userId, socketId }); }
const getUser = ( userId ) => { return users.find( user => user.userId === userId ); }
const removeUser = ( socketId ) => { users = users.filter( user => user.socketId !== socketId ); }

// Admin Client Operations
const addAdminClient = ( clientId, socketId ) => { !adminClients.some( adminClient => adminClient.clientId === clientId ) && adminClients.push({ clientId, socketId }); }
const getAddAdminClient = ( clientId ) => { return adminClients.find( client => client.clientId === clientId ); }
const removeAdminClient = ( socketId ) => { adminClients = adminClients.filter( adminClient => adminClient.socketId !== socketId ); }


// Evaluator Operations
const addEvaluator = ( userId, evaluatingUserId, socketId ) => { !evaluators.some( evaluator => evaluator.userId === userId ) && evaluators.push({ userId, evaluatingUserId, socketId }); }
const getEvaluatorsOnChat = ( evaluatingUserId ) => {
    return evaluators.filter(
        evaluator =>
            evaluator.evaluatingUserId === evaluatingUserId
    );
}
const removeEvaluator = ( socketId ) => {
    evaluator = evaluators.find( evaluator => evaluator.socketId === socketId );
    if( evaluator ){
        let user = getUser(evaluator.evaluatingUserId);
        if (user) {
            io.to(user.socketId).emit("evaluatorDisConnected", evaluator.userId);
        }
    }
    evaluators = evaluators.filter( evaluator => evaluator.socketId !== socketId );
}

// Logic
io.on(
    "connection",
    ( socket ) => {
        //when connect
        socket.on( "addUser", ( userId ) => {
            addUser( userId, socket.id );
            let connectedEvaluators = [...new Set(getEvaluatorsOnChat( userId ))];
            if( connectedEvaluators.length > 0 ){
                let connectedEvaluatorIdies = connectedEvaluators.map( evaluator => evaluator.userId );
                io.to( socket.id ).emit( "evaluatorConnected", connectedEvaluatorIdies );
            }
        });

        //when admin client connects
        socket.on( "addAdminClient", ( clientId ) => { addAdminClient( clientId, socket.id ); });

        //when evaluator starts to view a chat
        socket.on( "addEvaluatorToChat", ( userId, evaluatingUserId ) => {
          addEvaluator( userId, evaluatingUserId, socket.id );

          let eveluatingUser = getUser( evaluatingUserId );
          if( eveluatingUser ){
            io.to( eveluatingUser.socketId ).emit( "evaluatorConnected", userId );
          }
        });

        //send message
        socket.on(
            "sendMessage",
            ( chatObject, receiverIdList ) => {
                let rawEvaluatorsList = [];
                for (let receiverUserId of [...new Set(receiverIdList)]) {
                    const userId = typeof receiverUserId === 'object' ? receiverUserId.userId : receiverUserId;

                    let user = getUser(userId);
                    if (
                        user
                        && (
                            chatObject != null
                            && chatObject.message != null
                            && chatObject.message.sendedUserId.toString() !== null
                            && userId !== chatObject.message.sendedUserId.toString()
                        )
                    ) {
                        io.to(user.socketId).emit("getMessage", chatObject)
                    }

                    let evaluators = [...new Set(getEvaluatorsOnChat(userId))];
                    rawEvaluatorsList = rawEvaluatorsList.concat(evaluators);
                }

                //send message to evaluators
                let evaluators = [...new Set(rawEvaluatorsList)];
                if( evaluators.length > 0 ){
                    for (let evaluator of evaluators) {
                        io.to(evaluator.socketId).emit("getMessage", chatObject);
                    }
                }

            }
        );

        socket.on(
            "chatMemberLeaved",
            ({ chatId, leavedUserId, remainingActiveMembers }) => {
                let rawEvaluatorsList = [];
                for (let member of remainingActiveMembers) {
                    let user = getUser(member.userId);
                    if (user) {
                        io.to(user.socketId).emit("chatMemberLeaved", { chatId, leavedUserId });
                    }

                    let evaluators = [...new Set(getEvaluatorsOnChat(member.userId))];
                    rawEvaluatorsList = rawEvaluatorsList.concat(evaluators);
                }

                //send message to evaluators
                let evaluators = [...new Set(rawEvaluatorsList)];
                if( evaluators.length > 0 ){
                    for (let evaluator of evaluators) {
                        io.to(evaluator.socketId).emit("chatMemberLeaved", { chatId, leavedUserId });
                    }
                }
            }
        );

        //see message
        socket.on(
            "seeMessage",
            ( chatId, messageIdsList,  receiverIdList, userId ) => {
                let rawEvaluatorsList = [];
                let data = { chatId, messageIdsList, userId };
                for( let receiverId of [...new Set(receiverIdList)] ){
                    let receiver = getUser( receiverId );
                    if( receiver && receiver !== userId ){
                        io.to( receiver.socketId ).emit( "seenMessage", data );
                    }

                    let evaluators = [...new Set(getEvaluatorsOnChat(receiverId))];
                    rawEvaluatorsList = rawEvaluatorsList.concat(evaluators);
                }

                //send data to evaluators
                let evaluators = [...new Set(rawEvaluatorsList)];
                if( evaluators.length > 0 ){
                    for (let evaluator of evaluators) {
                        io.to(evaluator.socketId).emit("seenMessage", data);
                    }
                }
            }
        );

        //disconnect
        socket.on(
            "sendNotification",
            ( to, notificationObject ) => {
                let user = getUser( to );
                if( user ){ io.to(user.socketId).emit( "getNotification", notificationObject ) }
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
                removeEvaluator( socket.id );
            } 
        );
    }
);