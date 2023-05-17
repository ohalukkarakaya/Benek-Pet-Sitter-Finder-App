import mongoose from "mongoose";

const LogSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        method: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        contentLength: {
            type: String,
            required: true
        },
        responseTime: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        }
    }
);

export default mongoose.model("Log", LogSchema);