import Chat from "../../../models/Chat/Chat.js";
import meetingService from "../../../utils/meetingServices/meeting.service.js";

const isMeetingExistsController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
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

        await meetingService.isMeetingExists(
            userId,
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
                        isUserExist: result
                    }
                );
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

export default isMeetingExistsController;