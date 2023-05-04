import meetinServices from "../../../utils/meetingServices/meeting.service.js";
import User from "../../../models/User.js";

const createMeetController = async ( req, res, next ) => {
    try{
        const chatId = req.params.chatId.toString();
        const userId = user._id.toString();

        if(
            !chatId
            || !userId
        ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "Missing Param"
                }
            );
        }

        const user = await User.findById( req.user._id.toString() );
        
        const userName = (
            `${ user.identity.firstName } ${ user.identity.middleName } ${ user.identity.lastName }`
        ).replaceAll( "  ", " ");

        const model = {
            userId: user._id.toString(),
            joined: false,
            name: userName,
            isAlive: true
        };

        meetinServices.createMeeting(
            model,
            ( error, results ) => {
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
                        data: results
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

export default createMeetController;