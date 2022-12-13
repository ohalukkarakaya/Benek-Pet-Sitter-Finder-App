import mongoose from "mongoose";

const schema = mongoose.Schema;

const PhonetpVerificationSchema = new schema(
    {
        userId: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        expiresAt: {
            type: Date,
            default: Date.now() + 3600000
        },
    }
);

const PhoneOtpVerification = mongoose.model(
    "phoneOtpVerification",
    PhonetpVerificationSchema
);

export default PhoneOtpVerification;