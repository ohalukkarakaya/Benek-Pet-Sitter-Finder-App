import cron from "node-cron";
import PaymentData from "../models/PaymentData/PaymentData.js";

const expirePaymentData = cron.schedule(
    '0 0 0 * * *', // her gün gece 12:00
     // "* * * * *", // her dakika başı
    async () => {
        try{
            const now = new Date();

            await PaymentData.deleteMany({
                shouldBeDeleted: true,
                whenShouldBeDeleted: { $lte: now, $ne: null }
            });
        }catch( err ){
            console.log( err );
        }
    }
);

export default expirePaymentData;