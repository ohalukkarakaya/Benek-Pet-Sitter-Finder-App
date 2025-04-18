import preparePaymentRecordHelper from "../../utils/adminHelpers/preparePaymentRecordHelper.js";
import PaymentData from "../../models/PaymentData/PaymentData.js";


const getPaymentsFromDateController = async (req, res) => {
    try {
        const incomingStartDate = req.params.date;
        let date = new Date(incomingStartDate);

        let paymentDataList = await PaymentData.find({
            createdAt: {
                $gte: date
            }
        }).sort({ createdAt: -1 }).lean();

        if (!paymentDataList || paymentDataList.length <= 0) {
            return res.status(404)
                .json({ error: false, message: "No Payment Record Found" })
        }

        let paymentDataInfoList = await preparePaymentRecordHelper(paymentDataList);

        if (paymentDataInfoList.error) {
            return res.status(500)
                .json({ error: true, message: "Internal Server Error" });
        }
        paymentDataInfoList = paymentDataInfoList.data;
        return res.status(200)
            .json({
                error: false,
                message: "Payment Data Prepared Successfully",
                paymentDataInfoList: paymentDataInfoList
            });
    }catch (err) {
        console.error("ERROR: getPaymentsFromDateController - ", err);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
}

export default getPaymentsFromDateController;