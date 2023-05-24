import mongoose from "mongoose";

const schema = mongoose.Schema;

const PhoneOtpVerificationSchema = new schema(
    {
        userId: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        otp: {
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
    PhoneOtpVerificationSchema
);

export default PhoneOtpVerification;