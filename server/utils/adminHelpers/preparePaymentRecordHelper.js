import crypto from "crypto";
import User from "../../models/User.js";
import getLightWeightUserInfoHelper from "../getLightWeightUserInfoHelper.js";
import dotenv from "dotenv";

dotenv.config();

const getNationalIdNoHelper = async (user) => {
    //decrypt careGiver National IdNo
    const recordedIv = user.identity.nationalId.iv;
    const cryptedNationalId = user.identity.nationalId.idNumber;

    const iv = Buffer.from( recordedIv, 'hex' );
    const decipher = crypto.createDecipheriv(
        process.env.NATIONAL_ID_CRYPTO_ALGORITHM,
        Buffer.from( process.env.NATIONAL_ID_CRYPTO_KEY ),
        iv
    );

    let nationalIdNo = decipher.update( cryptedNationalId, 'hex', 'utf8' );
    nationalIdNo += decipher.final( 'utf8' );

    return nationalIdNo;
}

const preparePaymentRecordHelper = async (paymentDataList) => {
    try {
        let preparedPaymentInfoList = [];
        for (let paymentData of paymentDataList) {
            const careGiver = await User.findById(paymentData.subSellerId);
            const petOwner = await User.findById(paymentData.customerId);

            let careGiverInfo = careGiver ? await getLightWeightUserInfoHelper(careGiver) : "User Not Found";
            let petOwnerInfo = petOwner ? await getLightWeightUserInfoHelper(petOwner) : "User Not Found";

            let careGiverNationalIdNo = await getNationalIdNoHelper(careGiver)
            let petOwnerNationalIdNo = await getNationalIdNoHelper(petOwner)


            if (!careGiverInfo.identity) careGiverInfo.identity = {};
            careGiverInfo.identity.nationalIdentityNumber = careGiverNationalIdNo;
            careGiverInfo.location = careGiver.location;
            careGiverInfo.identity.openAdress = careGiver.identity.openAdress;
            careGiverInfo.phone = careGiver.phone;
            careGiverInfo.email = careGiver.email;

            if (!petOwnerInfo.identity) petOwnerInfo.identity = {};
            petOwnerInfo.identity.nationalIdentityNumber = petOwnerNationalIdNo;
            petOwnerInfo.location = careGiver.location;
            petOwnerInfo.identity.openAdress = petOwner.identity.openAdress;
            petOwnerInfo.phone = petOwner.phone;
            petOwnerInfo.email = petOwner.email;

            let paymentInfo = {
                paymentId: paymentData._id,
                careGiver: careGiverInfo,
                petOwner: petOwnerInfo,
                amount: paymentData.priceData.priceType !== "Free"
                    ?`${paymentData.priceData.price} ${paymentData.priceData.priceType}`
                    : "Free",
                status: paymentData.isPaid ? "Paid" : "Not Paid",
                createdAt: paymentData.createdAt
            };

            preparedPaymentInfoList.push(paymentInfo);
        }
        if( preparedPaymentInfoList.length <= 0 ){
            return {
                error: true,
                message: "No Payment Record Found"
            }
        }
        return {
            error: false,
            data: preparedPaymentInfoList
        }
    }catch (err) {
        console.error("ERROR: preparePaymentRecordHelper - ", err);
        return {
            error: true,
            message: "Internal Server Error"
        }
    }
}

export default preparePaymentRecordHelper;