import Story from "../models/Story.js";

import cron from "node-cron";
import dotenv from "dotenv";

import deleteFileHelper from "../utils/fileHelpers/deleteFileHelper.js";

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
                ( story ) => {
                    const contentUrl = story.contentUrl;

                    deleteFileHelper( contentUrl ).then(
                        ( data ) => {

                            if( data.error ){
                                console.log( `ERROR: while deleting story content '${ contentUrl }'` );
                            }

                            story.deleteOne()
                                 .then(
                                    (_) => {
                                        console.log("one story deleted");
                                    }
                                  );

                        }
                    );
                }
            );
        }catch( err){
            console.log(err);
        }
    }
);

export default expireStories;