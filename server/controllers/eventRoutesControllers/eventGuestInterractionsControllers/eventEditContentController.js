import dotenv from "dotenv";

dotenv.config();

const eventEditContentController = async (req, res) => {
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

        const  content = req.content;
        if(req.cdnUrl){
            content.isUrl = true
            content.value = req.cdnUrl;
        }else{
            content.value = req.body.newContent
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
        console.log("ERROR: edit after event interraction - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default eventEditContentController;