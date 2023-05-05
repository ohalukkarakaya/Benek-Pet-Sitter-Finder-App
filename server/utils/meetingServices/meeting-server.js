import meetingHelper from "./meeting-helper.js";
import MeetingPayloadEnum from "./meeting-payload.enum.js";
import Server from "socket.io";

function parseMessage( message ){
    try{
        const payload = JSON.parse( message );
        return payload;
    }catch( err ){
        console.log( err );
        return { type: MeetingPayloadEnum.UNKNOWN }
    }
}

function listenMessage(
    chatId,
    meetingId,
    socket,
    meetingServer
){
    socket.on( 
        'mes', 
        ( message ) => handleMessage(
            chatId,
            meetingId,
            socket,
            meetingServer
        ) 
    );
}

function handleMessage(
    chatId,
    meetingId,
    socket,
    message,
    meetingServer
){
    var payload = "";

    if( typeof message === 'string' ){
        payload = parseMessage( message )
    }else{
        payload = message;
    }

    switch( payload.type ){
        case MeetingPayloadEnum.JOIN_MEETING:
                meetingHelper.joinMeeting(
                    chatId,
                    meetingId,
                    socket,
                    payload,
                    meetingServer
                )
            break;

        case MeetingPayloadEnum.CONNECTION_REQUEST:
                meetingHelper.forwardConnectionRequest(
                    meetingId,
                    socket,
                    meetingServer,
                    payload,
                )
            break;

        case MeetingPayloadEnum.OFFER_SDP:
                meetingHelper.forwardOfferSDP(
                    meetingId,
                    socket,
                    meetingServer,
                    payload,
                )
            break;

        case MeetingPayloadEnum.ICECANDIDATE:
                meetingHelper.forwardIceCandidate(
                    meetingId,
                    socket,
                    meetingServer,
                    payload,
                )
            break;

        case MeetingPayloadEnum.ANSWER_SDP:
                meetingHelper.forwardAnswerSdp(
                    meetingId,
                    socket,
                    meetingServer,
                    payload,
                )
            break;

        case MeetingPayloadEnum.LEAVE_MEETING:
                meetingHelper.userLeft(
                    meetingId,
                    socket,
                    meetingServer,
                    payload,
                )
            break;

        case MeetingPayloadEnum.END_MEETING:
                meetingHelper.endMeeting(
                    chatId,
                    meetingId,
                    socket,
                    meetingServer,
                    payload,
                )
            break;

        case MeetingPayloadEnum.VIDEO_TOGGLE:
        case MeetingPayloadEnum.AUDIO_TOGGLE:
                meetingHelper.forwardEvent(
                    meetingId,
                    socket,
                    meetingServer,
                    payload,
                )
            break;

        case MeetingPayloadEnum.UNKNOWN:
            break;
    }
}

function initMeetingServer( server ){
    const meetingServer = new Server( server );

    meetingServer.on( 
        "connection",
        socket => {
            const chatId = socket.handshake.query.chatId;
            const meetingId = socket.handshake.query.meetingId;

            listenMessage(
                chatId,
                meetingId,
                socket,
                meetingServer
            )
        }
    )
}

export default initMeetingServer;