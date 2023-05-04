import Chat from "../../models/Chat/Chat.js";
import MeetingUser from "../../models/Chat/MeetingUser.js";

//get all meetings of chat function
async function getAllMeetingUsers( 
    chatId, 
    meetingId, 
    callback 
){
    try{
        const chat = await Chat.findById( chatId );
        const meeting = chat.meeting.where(
            meetingObject =>
                meetingObject._id.toString() === meetingId
        );

        if(
            !chat
            || !meeting
        ){
            const errorResponse = {
                error: true,
                statusCode: 400,
                message: "Meeting not found"
            }

            return callback( errorResponse );
        }

        MeetingUser.find(
            {
                meetingId: meeting._id.toString()
            }
        ).then(
            ( response ) => {
                return callback( null, response );
            }
        ).catch(
            ( error ) => {
                return callback( error );
            }
        )
    }catch( err ){
        console.log( err );
        return callback( err );
    }
}

//create meeting function
async function createMeeting(
    params,
    callback
){
    try{
        const userId = params.userId.toString();
        const chatId = params.chatId.toString();
        if(
            !chatId
            || !userId
        ){
            const errorObject = {
                error: true,
                statusCode: 400,
                message: "Missing param"
            };

            return callback( errorObject );
        }

        const chat = await Chat.findById( chatId );

        const isUserChatMember = chat.members.where(
            memberObject =>
                memberObject.userId.toString() === userId
        );

        if(
            !chat
            || !isUserChatMember
        ){
            const errorObject = {
                error: true,
                statusCode: 400,
                message: "Unauthorized"
            }

            return callback( errorObject );
        }

        let searchedMeetingUser;

        const meetingUser = await  MeetingUser.findOne(
            {
                userId: userId,
                meetingId: meeting._id.toString()
            }
        );

        if( !meetingUser ){

            if( !(params.meetingUser) ){
                errorObject = {
                    error: true,
                    statusCode: 400,
                    message: "MissingParams"
                }

                return callback( errorObject );
            }

            const meetingUser = new MeetingUser(
                params.meetingUser
            );

            meetingUser.save()
                       .then(
                            ( createdMeetingUser ) => {
                                searchedMeetingUser = createdMeetingUser;
                            }
                        ).catch(
                            ( err ) => {

                                if( err ){
                                    console.error( 'ERROR: While meetingUser', err );
                                    return callback( err );
                                }

                            }
                        );

        }else{
            meetingUser.isAlive = true;
            meetingUser.markModified( "isAlive" );
            meetingUser.save()
                       .then(
                            ( meetUser ) => {
                                searchedMeetingUser = meetUser;
                            }
                       ).catch(
                            ( err ) => {
                                if( err ){
                                    console.log( err );
                                    return callback( err );
                                }
                            }
                       );
        }

        if( !searchedMeetingUser ){
            const errorObject = {
                error: true,
                statusCode: 500,
                message: "Internal Server Error"
            };

            return callback( errorObject );
        }

        let newMeetingObject;
        newMeetingObject.joinedUsers = [ searchedMeetingUser._id ];

        chat.meeting.push( newMeetingObject );
        chat.markModified( "meeting" );
        chat.save()
            .then(
                ( meetingChat ) => {
                    searchedMeetingUser.meetingId = chat.meeting[ 0 ]._id;
                    searchedMeetingUser.markModified( "meetingId" );
                    searchedMeetingUser.save(
                        ( err ) => {
                            if( err ){
                                console.log( err );
                                return callback( err );
                            }
                        }
                    );
                    const responseObject = {
                        chatId: meetingChat._id.toString(),
                        metingObject: chat.meeting[ 0 ]
                    }
                    return callback( responseObject );
                }
            ).catch(
                ( err ) => {
                    return callback( err );
                }
            );
    }catch( err ){
        console.log( err );
        return callback( err );
    }
}

//join meeting function
async function joinMeeting(
    params,
    callback
){
    try{
        const userId = params.userId.toString();
        const chatId = params.chatId.toString();
        const meetingId = params.meetingId.toString();
        const socketId = params.socketId.toString();
        if(
            !userId
            || !chatId
            || !meetingId
            || !socketId
        ){
            const errorObject = {
                error: true,
                statusCode: 400,
                message: "Missing param"
            }

            return callback( errorObject );
        }

        const chat = await Chat.findById( chatId );
        const meeting = chat.meeting
                            .where(
                                meetingObject =>
                                    meetingObject._id
                                                 .toString() === meetingId
                            );

        const isUserChatMember = chat.members
                                     .where(
                                         memberObject =>
                                            memberObject.userId
                                                        .toString() === userId
                                     );

        if(
            !chat
            || !meeting
            || !isUserChatMember
        ){
            const errorObject = {
                error: true,
                statusCode: 401,
                message: "Unauthorized"
            }

            return callback( errorObject );
        }

        const pastlyRecordedMeetingUser = await  MeetingUser.findOne(
            {
                userId: userId,
                meetingId: meeting._id
                                  .toString()
            }
        );

        if( pastlyRecordedMeetingUser ){

            pastlyRecordedMeetingUser.socketId = socketId;
            pastlyRecordedMeetingUser.markModified( "socketId" );
            pastlyRecordedMeetingUser.save()
                                     .then(
                                        async ( savedMeetingUser ) => {

                                            meeting.joinedUsers
                                                   .push( savedMeetingUser._id );

                                            chat.markModified( "meeting" );

                                            chat.save()
                                                .then(
                                                    ( chatObject ) => {

                                                        const responseObject = {
                                                            meetingUserId: savedMeetingUser._id.toString(),
                                                            chatId: chatObject._id.toString()
                                                        }

                                                        return callback( null, responseObject );
                                                    }
                                                ).catch(
                                                    ( err ) => {
                                                        if( err){
                                                            console.error('ERROR: While update chat', err );
                                                            const errorObject = {
                                                                error: true,
                                                                statusCode: 500,
                                                                message: 'ERROR: While update chat'
                                                            }
            
                                                            return callback( errorObject );
                                                        }
                                                    }
                                                );
                                        }
                                    ).catch(
                                        ( err ) => {
                                            if( err){
                                                console.error('ERROR: While update meeting', err );
                                                const errorObject = {
                                                    error: true,
                                                    statusCode: 500,
                                                    message: 'ERROR: While update meeting'
                                                }

                                                return callback( errorObject );
                                            }
                                        }
                                    );

            
        }else{

            if( !(params.meetingUser) ){
                errorObject = {
                    error: true,
                    statusCode: 400,
                    message: "MissingParams"
                }

                return callback( errorObject );
            }

            const meetingUser = new MeetingUser(
                params.meetingUser
            );
    
            meetingUser.save()
                       .then(
                            async ( savedMeetingUser ) => {
                
                                meeting.joinedUsers.push( savedMeetingUser._id );
                                chat.markModified( "meeting" );
                                chat.save(
                    
                                    function ( err ) {
                                        if( err ) {

                                            console.error( `ERROR: ${ err }` );
                                            const errorObject = {
                                                error: true,
                                                statusCode: 500,
                                                message: "Internal server error"
                                            };

                                            return callback( errorObject );
                                        }
                                    }
                    
                                ).then(
                                    ( chatObject ) => {
                    
                                        const responseObject = {
                                                meetingUserId: savedMeetingUser._id.toString(),
                                                chatId: chatObject._id.toString()
                                        };
                                        callback( null, responseObject );
                    
                                    }
                                )
                
                            }
                        ).catch(
                            ( err ) => {
                                if( err){
                                    console.error('ERROR: While update meetingUser', err );
                                    const errorObject = {
                                        error: true,
                                        statusCode: 500,
                                        message: 'ERROR: While update meetingUser'
                                    }

                                    return callback( errorObject );
                                }
                            }
                        );

        }
    }catch( err ){
        console.log( err );
        return callback( err );
    }
}

// To Do: check if there is meeting by id function
async function isMeetingExists(
    userId,
    chatId,
    meetingId,
    callback
){
    try{

        const chat = await Chat.findById( chatId );
        const isUserMemberOfChat = chat.members.where(
            member =>
                member.userId.toString() === userId
        );
        if( !isUserMemberOfChat ){
            const errorObject = {
                error: true,
                statusCode: 401,
                message: "Unauthorized"
            }

            return callback( errorObject );
        }
        
        const meeting = await chat.meeting.where(
            meetingObject =>
                meetingObject._id.toString() === meetingId
        );

        if( 
            !chat
            || !meeting
        ){
            return callback( null, false );
        }else{
            return callback( null, true );
        }
    }catch( err ){
        console.log( err );
        return callback( err );
    }
}

//get meeting user
async function getMeetingUser(
    params,
    callback
){
    try{
        const meetingId = params.meetingId.toString();
        const userId = params.userId.toString();
        if(
            !meetingId
            || !userId
        ){
            const errorObject = {
                error: true,
                statusCode: 400,
                message: "Missing Param"
            };

            return callback( errorObject );
        }

        const meetingUser = await MeetingUser.findOne(
            {
                meetingId: meetingId,
                userId: userId
            }
        );
        if( !meetingUser ){
            const errorObject = {
                error: true,
                statusCode: 404,
                message: "user not found"
            };

            return callback( errorObject );
        }

        const responseObject = {
            error: false,
            message: "Meeting User Found Succesfuly",
            meetingUser: meetingUser
        };

        return callback( null, responseObject );

    }catch( err ){
        console.log( err );
        return callback( err );
    }
}

//update meeting user
async function updateMeetingUser(
    params,
    callback
){
    try{
        MeetingUser.updateOne(
            {  userId: params.userId },
            { $set: params },
            { new: true }
        ).then(
            ( response ) => {
                return callback( null, response );
            }
        ).catch(
            ( error ) => {
                return callback( error );
            }
        );
    }catch( err ){
        console.log( err );
        return callback( err );
    }
}

// get user by socket id
async function getUserBySocketId(
    params,
    callback
){
    try{
        const { meetingId, socketId } = params;
        if(
            !meetingId
            || !socketId
        ){
            const errorObject = {
                error: true,
                messaage: "missing params"
            }
            return callback( errorObject );
        }

        MeetingUser.findOne(
            {
                meetingId: meetingId,
                socketId: socketId
            }
        ).then(
            ( meetingUser ) => {
                return callback( null, meetingUser );
            }
        ).catch(
            ( error ) => {
                return callback( error );
            }
        );
    }catch( err ){
        console.log( err );
        return callback( err );
    }
}

export default {
    createMeeting,
    joinMeeting,
    getAllMeetingUsers,
    isMeetingExists,
    getUserBySocketId,
    updateMeetingUser,
    getMeetingUser
};

