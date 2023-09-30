import Log from "../models/Log.js";

import cron from "node-cron";

// - tested
const deleteOverTimedLogs = cron.schedule(
    '0 0 0 * * *', // her gün gece 12:00
    // "* * * * *", // her dakika başı
    async () => {
        try{
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate( thirtyDaysAgo.getDate() - 30 );

            // 30 günden eski olan belgeleri sil
            const result = await Log.deleteMany({ date: { $lt: thirtyDaysAgo } });
            console.log(`${result.deletedCount} Log silindi.`);
        }catch( err ){
            console.error('Belge silme hatası:', error);
        }
    }
);

export default deleteOverTimedLogs;