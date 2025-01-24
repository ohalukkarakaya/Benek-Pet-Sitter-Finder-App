import mongoose from "mongoose";

const BanUserASAPRecordSchema = new mongoose.Schema(
    {
        adminId: { type: String, required: true },
        userId: { type: String, required: true },
        banReason: { type: String, required: true },
        banDate: { type: Date, default: Date.now() },
    },
    {
        timestamps: true
    }
);

export default mongoose.model( "BanUserASAPRecord", BanUserASAPRecordSchema );