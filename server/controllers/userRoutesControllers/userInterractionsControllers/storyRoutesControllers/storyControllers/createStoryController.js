import User from "../../../../../models/User.js";
import Story from "../../../../../models/Story.js";
import dotenv from "dotenv";

dotenv.config();

const createStoryController = async (req, res) => {
    try{
        const contentUrl = req.cdnUrl;
        if(!contentUrl){
            return res.status(400).json(
                {
                    error: true,
                    message: "Content required"
                }
            );
        }

        const user = await User.findById(req.user._id);
        if(!user || user.deactivation.isDeactive){
            return res.status(404).json(
                {
                    error: true,
                    message: "User couldn't found"
                }
            );
        }

        if(
            !req.body.aboutId
            || !req.body.aboutType
        ){
            return res.status(400).json(
                {
                    error: true,
                    message: "Story must be about an event, pet or user"
                }
            );
        }

        await new Story(
            {
                userId: user._id.toString(),
                about: {
                    id: req.body.aboutId,
                    aboutType: req.body.aboutType
                },
                desc: req.body.desc,
                contentUrl: contentUrl
            }
        ).save().then(
            (story) => {
                return res.status(200).json(
                    {
                        error: false,
                        message: `Story with id ${story._id}, created succesfully`,
                        storyId: story._id.toString(),
                        contentUrl: story.contentUrl,
                        storyExpireDate: story.expiresAt
                    }
                );
            }
        ).catch(
            (error) => {
                return res.status(500).json(
                    {
                        error: true,
                        message: "An error occured while saving story data"
                    }
                );
            }
        );
    }catch(err){
        console.log("ERROR: create story - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default createStoryController;