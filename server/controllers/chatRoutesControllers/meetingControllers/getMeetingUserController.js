import MeetingUser from "../../../models/Chat/MeetingUser.js";

const getMeetingUserController = async ( req, res ) => {
    try{
        const meetingId = req.params.meetingId.toString();
        const userId = req.params.userId.toString();
        if(
            !meetingId
            || !userId
        ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "Missing Param"
                }
            );
        }

        const meetingUser = await MeetingUser.findOne(
            {
                meetingId: meetingId,
                userId: userId
            }
        );
        if( !meetingUser ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "user not found"
                }
            );
        }

        return res.status( 200 ).json(
            {
                error: false,
                message: "Meeting User Found Succesfuly",
                meetingUser: meetingUser
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

export default getMeetingUserController;