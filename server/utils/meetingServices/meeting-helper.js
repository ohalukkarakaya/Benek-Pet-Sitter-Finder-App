import meetingService from "./meeting.service.js";
import MeetingPayloadEnum from "./meeting-payload.enum.js";

async function joinMeeting(
    chatId,
    meetingId,
    socket,
    payload,
    meetingServer
){
    try{
        const { userId, name } = payload.data;

        meetingService.isMeetingExists(
            userId,
            chatId,
            meetingId,
            async( error, result ) => {
                if( error || !result ){
                    sendMessage(
                        socket,
                        {
                            type: MeetingPayloadEnum.NOT_FOUND
                        }
                    );
                }

                if( result ){
                    addUser(
                        socket,
                        {
                            chatId,
                            meetingId,
                            userId,
                            name
                        }
                    ).then(
                        ( result ) => {
                            if( result ){
                                sendMessage(
                                    socket,
                                    {
                                        type: MeetingPayloadEnum.JOINED_MEETING,
                                        data: {
                                            userId
                                        }
                                    }
                                )

                                broadCastUsers(
                                    chatId,
                                    meetingId,
                                    socket,
                                    meetingServer,
                                    {
                                        type: MeetingPayloadEnum.USER_JOINED,
                                        data: {
                                            userId,
                                            name,
                                            ...payload.data
                                        }
                                    }
                                );
                            }
                        },
                        ( error ) => {
                            console.log( error );
                        }
                    );
                }
            }
        );
    }catch( err ){
        console.log( err );
    }
}

function forwardConnectionRequest(
    meetingId,
    socket,
    meetingServer,
    payload
){
    try{
        const { userId, otherUserId, name } = payload.data;

        var model = {
            meetingId: meetingId,
            userId: otherUserId
        };

        meetingService.getMeetingUser(
            model,
            ( error, result ) => {
                if( result ){
                    var sendPayload = JSON.stringify(
                        {
                            type: MeetingPayloadEnum.CONNECTION_REQUEST,
                            data: {
                                userId,
                                name,
                                ...payload
                            }
                        }
                    );

                    meetingServer.to( result.meetingUser.socketId ).emit( 'mes', sendPayload );
                }
            }
        )
    }catch( err ){
        console.log( err );
    }
}

function forwardIceCandidate(
    meetingId,
    socket,
    meetingServer,
    payload
){
    try{
        const { userId, otherUserId, candidate } = payload.data;

        var model = {
            meetingId: meetingId,
            userId: otherUserId
        };

        meetingService.getMeetingUser(
            model,
            ( error, result ) => {
                if( result ){
                    var sendPayload = JSON.stringify(
                        {
                            type: MeetingPayloadEnum.ICECANDIDATE,
                            data: {
                                userId,
                                candidate
                            }
                        }
                    );

                    meetingServer.to( result.meetingUser.socketId ).emit( 'mes', sendPayload );
                }
            }
        )
    }catch( err ){
        console.log( err );
    }
}

function forwardOfferSDP(
    meetingId,
    socket,
    meetingServer,
    payload
){
    try{
        const { userId, otherUserId, sdp } = payload.data;

        var model = {
            meetingId: meetingId,
            userId: otherUserId
        };

        meetingService.getMeetingUser(
            model,
            ( error, result ) => {
                if( result ){
                    var sendPayload = JSON.stringify(
                        {
                            type: MeetingPayloadEnum.OFFER_SDP,
                            data: {
                                userId,
                                sdp
                            }
                        }
                    );

                    meetingServer.to( result.meetingUser.socketId ).emit( 'mes', sendPayload );
                }
            }
        )
    }catch( err ){
        console.log( err );
    }
}

function forwardAnswerSdp(
    meetingId,
    socket,
    meetingServer,
    payload
){
    try{
        const { userId, otherUserId, sdp } = payload.data;

        var model = {
            meetingId: meetingId,
            userId: otherUserId
        };

        meetingService.getMeetingUser(
            model,
            ( error, result ) => {
                if( result ){
                    var sendPayload = JSON.stringify(
                        {
                            type: MeetingPayloadEnum.ANSWER_SDP,
                            data: {
                                userId,
                                sdp
                            }
                        }
                    );

                    meetingServer.to( result.meetingUser.socketId ).emit( 'mes', sendPayload );
                }
            }
        )
    }catch( err ){
        console.log( err );
    }
}

function userLeft(
    meetingId,
    socket,
    meetingServer,
    payload
){
    try{
        const { userId } = payload.data;

        broadCastUsers(
            meetingId, 
            socket, 
            meetingServer,
            {
                type: MeetingPayloadEnum.USER_LEFT,
                data: {
                    userId: userId
                }
            }
        );
    }catch( err ){
        console.log( err );
    }
}

function endMeeting(
    chatId,
    meetingId,
    socket,
    meetingServer,
    payload
){
    try{
        const { userId } = payload.data;

        broadCastUsers(
            meetingId, 
            socket, 
            meetingServer,
            {
                type: MeetingPayloadEnum.MEETING_ENDED,
                data: {
                    userId: userId
                }
            }
        );

        meetingService.getAllMeetingUsers(
            chatId,
            meetingId,
            ( error, result ) => {
                for( let i = 0; i < result.length; i++ ){
                    const meetingUser = result[i];
                    meetingServer.sockets.connected[ meetingId.socketId ].disconnect();
                }
            }
        );
    }catch( err ){
        console.log( err );
    }
}

function forwardEvent(
    meetingId,
    socket,
    meetingServer,
    payload
){
    try{
        const { userId } = payload.data;

        broadCastUsers(
            meetingId, 
            socket, 
            meetingServer,
            {
                type: payload.type,
                data: {
                    userId: userId,
                    ...payload.data
                }
            }
        );
    }catch( err ){
        console.log( err );
    }
}

function addUser(
    socket,
    {
        chatId,
        meetingId,
        userId,
        name
    }
){
    let promise = new Promise(
        function( resolve, reject ){
            var model = {
                chatId: chatId,
                socketId: socket.id,
                meetingId: meetingId,
                userId: userId,
                joined: true,
                name: name,
                isAlive: true,
            };

            meetingService.joinMeeting(
                model,
                ( error, result ) => {
                    if( result ){
                        resolve( result );
                    }

                    if( error ){
                        reject( error );
                    }
                }
            );
        }
    );

    return promise;
}

function sendMessage( socket, payload ){
    socket.send( JSON.stringify( payload ) );
}

function broadCastUsers(
    chatId,
    meetingId,
    socket,
    meetingServer,
    payload
){
    socket.broadcast.emit( "mes", JSON.stringify( payload ) );
}

export default {
    joinMeeting,
    forwardConnectionRequest,
    forwardIceCandidate,
    forwardOfferSDP,
    forwardAnswerSdp,
    userLeft,
    endMeeting,
    forwardEvent
}