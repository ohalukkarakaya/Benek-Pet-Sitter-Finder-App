import mongoose from "mongoose";

const LogSchema = new mongoose.Schema(
  {
      userId: {
          type: String,
          required: true,
      },
      endPoint: {
        type: String,
        required: true,
      },
      errorStatus: {
        type: Boolean,
        default: false,
      },
      error: {
        message: {
            type: String,
            required: true
        },
        errorStatusCode: {
            type: String
        }
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

export default mongoose.model("Log", LogSchema);