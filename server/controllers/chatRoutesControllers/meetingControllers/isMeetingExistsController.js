import Chat from "../../../models/Chat/Chat.js";
import MeetingUser from "../../../models/Chat/MeetingUser.js";

const isMeetingExistsController = async ( req, res ) => {
    try{
        const chatId = req.params.chatId.toString();
        const meetingId = req.params.meetingId.toString();
        if(
            !chatId
            || !meetingId
        ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "Missing Params"
                }
            );
        }

        const chat = await Chat.findById( chatId );
        const isUserMemberOfChat = chat.members.where(
            member =>
                member.userId.toString === req.user._id.toString()
        );
        if( !isUserMemberOfChat ){
            return res.status( 401 ).json(
                {
                    error: true,
                    message: "Unauthorized"
                }
            );
        }
        
        const meeting = await chat.meeting.where(
            meetingObject =>
                meetingObject._id.toString() === meetingId
        );

        if( 
            !chat
            || !meeting
        ){
            return res.status( 200 ).json(
                {
                    error: false,
                    message: "Meeting Not Found",
                    isMeetingExist: false
                }
            );
        }else{
            return res.status( 200 ).json(
                {
                    error: false,
                    message: "Meeting Found",
                    isMeetingExist: true
                }
            );
        }
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

export default isMeetingExistsController;