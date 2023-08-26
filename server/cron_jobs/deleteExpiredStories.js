import cron from "node-cron";
import Story from "../models/Story.js";
import s3 from "../utils/s3Service.js";
import dotenv from "dotenv";

dotenv.config();

// - tested
const expireStories = cron.schedule(
    '0 0 */1 * * *',
    // "* * * * *", // her dakika başı
    async () => {
        try{
            const now = new Date();

            const currentYear = now.getUTCFullYear();
            const currentMonth = now.getUTCMonth();
            const currentDate = now.getUTCDate();
            const currentHour = now.getUTCHours();

            const currentDateTime = new Date(
                                            currentYear, 
                                            currentMonth, 
                                            currentDate, 
                                            currentHour, 
                                            0, 
                                            0, 
                                            0
                                        );

            const expiredStories = await Story.find()
                                              .where('expiresAt')
                                              .lte( currentDateTime );

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