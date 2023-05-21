import mongoose from "mongoose";

const TempPasswordSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        tempPassword: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now()
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("TempPassword", TempPasswordSchema);