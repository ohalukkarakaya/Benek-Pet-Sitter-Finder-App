import Chat from "../../../models/Chat/Chat.js";
import meetingService from "../../../utils/meetingServices/meeting.service.js";

const getAllMeetingUsersController = async ( req, res ) => {
    try{
        const chatId = req.params.chatId.toString();
        const meetingId = req.params.meetingId.toString();
        if(
            !chatId
            || !meetingId
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

        if(
            !chat
            || !meeting
        ){
            return res.status(404).json(
                {
                    error: true,
                    message: "Meeting not found"
                }
            );
        }

        await meetingService.getAllMeetingUsers(
            chatId,
            meetingId,
            ( error, result ) => {
                if( error ){
                    return res.status( error.statusCode ).json(
                        {
                            error: true,
                            message: error.message
                        }
                    );
                }

                return res.status( 200 ).json(
                    {
                        error: false,
                        meetingUsers: result
                    }
                );
            }
        )
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

export default getAllMeetingUsersController;