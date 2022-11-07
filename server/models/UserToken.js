import mongoose from "mongoose";

const UserTokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            require: true
        },
        token: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 30 * 86400
        }
    }
);

export default mongoose.model("UserToken", UserTokenSchema);