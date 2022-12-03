import mongoose from "mongoose";

const PetHandOverInvitationSchema = new mongoose.Schema(
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
          required: true,
      },
  },
  {
      timestamps: true
  }
);

export default mongoose.model("PetHandOverInvitation", PetHandOverInvitationSchema);