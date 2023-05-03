import Chat from "../../../models/Chat/Chat.js";
import MeetingUser from "../../../models/Chat/MeetingUser.js";

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

        MeetingUser.find(
            {
                meetingId: meeting._id.toString()
            }
        ).then(
            ( response ) => {
                return res.status(200).json(
                    {
                        error: false,
                        message: "Users Found Succesfully",
                        users: response
                    }
                );
            }
        ).catch(
            ( error ) => {
                return res.status(500).json(
                    {
                        error: true,
                        message: "Internal Server Error"
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