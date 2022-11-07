import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserTokenSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
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

module.exports = mongoose.model("UserToken", UserTokenSchema);