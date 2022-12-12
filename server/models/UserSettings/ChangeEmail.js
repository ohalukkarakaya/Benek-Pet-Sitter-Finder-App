import mongoose from "mongoose";

const ChenageEmailSchema = new mongoose.Schema(
  {
    userId: {
          type: String,
          required: true,
    },
    newEmail: {
        type: String,
        required: true,
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

export default mongoose.model("ChangeEmailOTP", ChenageEmailSchema);