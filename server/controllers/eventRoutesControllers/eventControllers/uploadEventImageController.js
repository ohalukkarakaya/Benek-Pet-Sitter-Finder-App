import dotenv from "dotenv";

dotenv.config();

const uploadEventImageController = async (req, res) => {
    try{
        const contentUrl = req.cdnUrl;
        if(!contentUrl){
            return res.status(400).json(
                {
                    error: true,
                    message: "image is required"
                }
            );
        }
        
        req.meetingEvent.ımgUrl = contentUrl;
        req.meetingEvent.markModified("imgUrl");
        req.save(
            (err) => {
                if(err){
                    console.log(err);
                    return res.status.json(
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
                message: "image uploaded succesfully",
                imgUrl: contentUrl
            }
        );
    }catch(err){
        console.log("ERROR: upload event image - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default uploadEventImageController;