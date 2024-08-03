import Story from "../../../../../models/Story.js";
import s3 from "../../../../../utils/s3Service.js";
import dotenv from "dotenv";
import deleteFileHelper from "../../../../../utils/fileHelpers/deleteFileHelper.js";

dotenv.config();

const deleteStoryController = async (req, res) => {
    try{
        const storyId = req.body.storyId;
        if(!storyId){
            return res.status(400).json(
                {
                    error: true,
                    message: "storyId is required"
                }
            );
        }

        const story = await Story.findById( storyId );
        if(!story){
            return res.status(404).json(
                {
                    error: true,
                    message: "Story couldn't found"
                }
            );
        }

        if(story.userId !== req.user._id.toString()){
            return res.status(401).json(
                {
                    error: true,
                    message: "you can't delete this story"
                }
            );
        }

        const contentUrl = story.contentUrl;
        const splitUrl = contentUrl.split('/');
        const contentName = splitUrl[splitUrl.length - 1];

        const deleteContentParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: `profileAssets/${req.user._id.toString()}/story/${contentName}`
        };

        const deleteAssets = await deleteFileHelper( story.contentUrl );
        if( deleteAssets.error ){ console.log( `ERROR: delete assets - ${ story._id.toString() }` ); }

        story.deleteOne().then(
            (_) => {
                return res.status(200).json(
                    {
                        error: false,
                        message: "Story deleted succesfully"
                    }
                );
            }
        );
    }catch(err){
        console.log("ERROR: delete story - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default deleteStoryController;