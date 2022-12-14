import cron from "node-cron";
import Story from "../models/Story.js";
import s3 from "../utils/s3Service.js";
import dotenv from "dotenv";

dotenv.config();

const expireStories = cron.schedule(
    '0 0 */1 * * *',
    async () => {
        try{
            const expiredStories = await Story.find().where('expiresAt').lte(Date.now());
            expiredStories.map(
                (story) => {
                    const contentUrl = story.contentUrl;
                    const splitUrl = contentUrl.split('/');
                    const contentName = splitUrl[splitUrl.length - 1];

                    const userId = story.userId;

                    const deleteContentParams = {
                        Bucket: process.env.BUCKET_NAME,
                        Key: `profileAssets/${userId}/story/${contentName}`
                    };

                    s3.deleteObject(
                        deleteContentParams,
                        (error, data) => {
                            if(error){
                                console.log("error", error);
                            }

                            story.deleteOne().then(
                                (_) => {
                                    console.log("one story deleted");
                                }
                            );
                        }
                    );
                }
            );
        }catch(err){
            console.log(err);
        }
    }
);

export default expireStories;