import Chat from "../../../models/Chat/Chat.js";
import MeetingUser from "../../../models/Chat/MeetingUser.js";

const joinMeetingController = async ( req, res ) => {
    try{
        const chatId = req.params.chatId.toString();
        const meetingId = req.params.meetingId.toString();
        const socketId = req.body.socketId.toString();
        if(
            !chatId
            || !meetingId
            || !socketId
        ){
            return res.status(400).json(
                {
                    error: true,
                    message: "Missing param"
                }
            );
        }

        const chat = await Chat.findById( chatId );
        const meeting = chat.meeting.where(
            meetingObject =>
                meetingObject._id.toString() === meetingId
        );

        const isUserChatMember = chat.members.where(
            memberObject =>
                memberObject.userId.toString === req.user._id.toString()
        );

        if(
            !chat
            || !meeting
            || isUserChatMember
        ){
            return res.status( 401 ).json(
                {
                    error: true,
                    message: Unauthorized
                }
            );
        }

        const pastlyRecordedMeetingUser =await  MeetingUser.findOne(
            {
                userId: req.user._id.toString(),
                meetingId: meeting._id.toString()
            }
        );

        if( pastlyRecordedMeetingUser ){

            pastlyRecordedMeetingUser.socketId = socketId;
            pastlyRecordedMeetingUser.markModified( "socketId" );
            pastlyRecordedMeetingUser.save(
                (err) => {
                    if(err){
                        console.error('ERROR: While following pet - user side!');
                        return res.status(500).json(
                            {
                                error: true,
                                message: 'ERROR: While following pet - user side!'
                            }
                        );
                    }
                }
            ).then(
                async ( savedMeetingUser ) => {
                    meeting.joinedUsers.push( savedMeetingUser._id );
                    chat.markModified( "meeting" );
                    chat.save(
                        function ( err ) {

                            if( err ) {
                                console.error( `ERROR: ${ err }` );
                                return res.status( 500 ).json(
                                    {
                                        error: true,
                                        message: "Internal server error"
                                    }
                                );
                            }

                        }
                    ).then(
                        ( chatObject ) => {

                            return res.status( 200 ).json(
                                {
                                    error: false,
                                    message: "User Created And Added To Meeting Succesfully",
                                    meetingUserId: savedMeetingUser._id.toString(),
                                    chatId: chatObject._id.toString()
                                }
                            );

                        }
                    )
                }
            );

            
        }else{

            const meetingUser = new MeetingUser(
                //To Do
            );
    
            meetingUser.save(
                (err) => {

                    if(err){
                        console.error('ERROR: While following pet - user side!');
                        return res.status(500).json(
                            {
                                error: true,
                                message: 'ERROR: While following pet - user side!'
                            }
                        );
                    }

                }
            ).then(
                async ( savedMeetingUser ) => {
    
                    meeting.joinedUsers.push( savedMeetingUser._id );
                    chat.markModified( "meeting" );
                    chat.save(
        
                        function ( err ) {
                            if( err ) {
                                console.error( `ERROR: ${ err }` );
                                return res.status( 500 ).json(
                                    {
                                        error: true,
                                        message: "Internal server error"
                                    }
                                );
                            }
                        }
        
                    ).then(
                        ( chatObject ) => {
        
                            return res.status( 200 ).json(
                                {
                                    error: false,
                                    message: "User Created And Added To Meeting Succesfully",
                                    meetingUserId: savedMeetingUser._id.toString(),
                                    chatId: chatObject._id.toString()
                                }
                            );
        
                        }
                    )
    
                }
            )

        }
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

export default joinMeetingController;