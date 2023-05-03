import mongoose from "mongoose";

const MeetingUserSchema = new mongoose.Schema(
    {
        socketId: {
            type: String
        },
        meetingId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        userId: {
          type: String,
          required: true
        },
        joined: {
          type: Boolean,
          required: true
        },
        name: {
          type: String,
          required: true
        },
        isAlive: {
            type: Boolean,
            required: true
        }
    },
    {
        timestamps: true
    }
  );
  
  export default mongoose.model("MeetingUser", MeetingUserSchema);