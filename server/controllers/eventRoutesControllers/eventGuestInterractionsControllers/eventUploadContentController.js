import dotenv from "dotenv";

dotenv.config();

const eventUploadContentController = async (req, res) => {
    try{
        const eventId = req.params.eventId;
        if(!eventId){
            return res.status(400).json(
                {
                    error: true,
                    message: "eventId is required"
                }
            );
        }

        let content;
        let isUrl;
        if(req.cdnUrl){
            isUrl = true
            content = req.cdnUrl;
        }else{
            content = req.body.content
        }

        if(!content){
            return res.status(400).json(
                {
                    error: true,
                    message: "content is required"
                }
            );
        }

        const meetingEvent = req.meetingEvent;

        meetingEvent.afterEvent.push(
            {
                userId: req.user._id.toString(),
                content: {
                    isUrl: isUrl,
                    value: content
                },
            }
        );

        meetingEvent.markModified("afterEvent");
        meetingEvent.save(
            (error) => {
                if(error){
                    console.log(error);
                    return res.status(500).json(
                        {
                            error: true,
                            message: "Internal server error"
                        }
                    );
                }
            }
        );

        return res.status(200).json(
            {
                error: false,
                message: "content add succesfully"
            }
        );
    }catch(err){
        console.log("ERROR: after event interraction - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default eventUploadContentController;