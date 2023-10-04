import PunishmentRecord from "../models/Report/PunishmentRecord.js";

import cron from "node-cron";

const expirePunishments = cron.schedule(
    '0 0 0 * * *', // her gün gece 12:00
    // "* * * * *", // her dakika başı
    async () => {
        try{
            const now = new Date();

            const currentYear = now.getUTCFullYear();
            const currentMonth = now.getUTCMonth();
            const currentDate = now.getUTCDate();
            const currentHour = now.getUTCHours();
            const currentDateTime = new Date( currentYear, currentMonth, currentDate, currentHour, 0, 0, 0 );
            const fortyFiveDaysAgo = currentDateTime.setDate( now.getDate() - 45 );
            
            await PunishmentRecord.deleteMany({ updatedAt: { $lte: fortyFiveDaysAgo } });
        }catch( err ){
            console.log( err );
        }
    }
);

export default expirePunishments;