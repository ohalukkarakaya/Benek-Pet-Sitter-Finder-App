import mongoose from "mongoose";

const schema = mongoose.Schema;

const UserOtpVerificationSchema = new schema(
    {
        userId: {
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

const UserOtpVerification = mongoose.model(
    "UserOtpVerification",
    UserOtpVerificationSchema
);

export default UserOtpVerification;