import mongoose from "mongoose";

const SecondaryOwnerInvitationSchema = new mongoose.Schema(
  {
      from: {
          type: String,
          required: true,
      },
      to: {
        type: String,
        required: true,
      },
      petId: {
          type: String,
      },
      situation: {
        isAccepted: Boolean,
        time: Date
      }
  },
  {
      timestamps: true
  }
);

export default mongoose.model("SecondaryOwnerInvitation", SecondaryOwnerInvitationSchema);