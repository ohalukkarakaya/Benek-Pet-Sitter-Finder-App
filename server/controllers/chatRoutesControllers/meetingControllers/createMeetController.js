import Chat from "../../../models/Chat/Chat.js";
import MeetingUser from "../../../models/Chat/MeetingUser.js";

const createMeetController = async ( req, res ) => {
    try{
        const chatId = req.params.chatId.toString();
        if(
            !chatId
        ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "Missing param"
                }
            );
        }

        const chat = await Chat.findById( chatId );

        const isUserChatMember = chat.members.where(
            memberObject =>
                memberObject.userId.toString === req.user._id.toString()
        );

        if(
            !chat
            || !isUserChatMember
        ){
            return res.status( 401 ).json(
                {
                    error: true,
                    message: Unauthorized
                }
            );
        }

        let searchedMeetingUser;

        const meetingUser = await  MeetingUser.findOne(
            {
                userId: req.user._id.toString(),
                meetingId: meeting._id.toString()
            }
        );

        if( !meetingUser ){

            const meetingUser = new MeetingUser(
                //To Do
            );

            meetingUser.save(
                ( err ) => {

                    if( err ){
                        console.error('ERROR: While following pet - user side!');
                        return res.status( 500 ).json(
                            {
                                error: true,
                                message: 'ERROR: While following pet - user side!'
                            }
                        );
                    }

                }
            ).then(
                ( createdMeetingUser ) => {
                    searchedMeetingUser = createdMeetingUser;
                }
            );

        }else{
            meetingUser.isAlive = true;
            meetingUser.markModified( "isAlive" );
            meetingUser.save(
                (err) => {
                    if(err){
                        console.log(err);
                        return res.status( 500 ).json(
                            {
                                error: true,
                                message: "Internal Server Error"
                            }
                        );
                    }
                }
            ).then(
                ( meetUser ) => {
                    searchedMeetingUser = meetUser;
                }
            );
        }

        if( !searchedMeetingUser ){
            return res.status( 500 ).json(
                {
                    error: true,
                    message: "Internal Server Error"
                }
            );
        }

        let newMeetingObject;
        newMeetingObject.joinedUsers = [ searchedMeetingUser._id ];

        chat.meeting.push( newMeetingObject );
        chat.markModified( "meeting" );
        chat.save(
            (err) => {
                if(err){
                    console.log(err);
                    return res.status( 500 ).json(
                        {
                            error: true,
                            message: "Internal Server Error"
                        }
                    );
                }
            }
        );



    }catch( err ){
        console.log( err );
        res.status( 500 ).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default createMeetController;