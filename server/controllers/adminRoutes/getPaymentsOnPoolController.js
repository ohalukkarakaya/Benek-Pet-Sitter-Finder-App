import PaymentData from "../../models/PaymentData/PaymentData.js";

//  *                *         .                      *            .   *           .    *
//                                *                  *  .                .
//  *                *        .       *                ☾         *.             *.     .  *.   .
//      *           .       *                *                 .               *.        *   .
//     . getPaymentsOnPoolController   *       .         * .                  .  

const getPaymentsOnPoolController = async ( req, res ) => {
    try {
        const paymentDataList = await PaymentData.find();
        if (!paymentDataList || paymentDataList.length === 0) {
            return res.status(404).json({ error: false, message: "No Payment On Pool" });
        }

        let customersShare = 0;
        let customersTax = 0;
        let profit = 0;

        const totalPrice = paymentDataList.reduce(
            (acc, paymentData) => {
                return acc + paymentData.priceData.price;
            },
            0
        );

        for (let paymentData of paymentDataList) {
            const { price, priceType } = paymentData.priceData;

            // Oranlara göre ayrılan payları hesapla ve topla
            if (priceType === "TL") {
                customersShare += price * 0.7;
                customersTax += price * 0.1;
                profit += price * 0.2;
            } else if (priceType === "USD" || priceType === "EUR") {
                // Döviz hesaplamalarını buraya eklenecek, örneğin, TL'ye çevirme işlemleri
                // customersShare += convertedPrice * 0.7;
                // customersTax += convertedPrice * 0.1;
                // profit += convertedPrice * 0.2;
            }
        }

        // Sayıları iki ondalık basamakla yuvarla
        customersShare = parseFloat( customersShare.toFixed(2) );
        customersTax = parseFloat( customersTax.toFixed(2) );
        profit = parseFloat( profit.toFixed(2) );

        return res.status(200).json({
            error: false,
            message: "Price Count Successfully",
            profit: profit,
            customersShare: customersShare,
            customersTax: customersTax,
            totalMoneyOnPool: totalPrice,
        });
    } catch (err) {
        console.log("ERROR: getPaymentsOnPoolController - ", err);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};

export default getPaymentsOnPoolController;
