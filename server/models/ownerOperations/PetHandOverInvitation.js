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
      },
  },
  {
      timestamps: true
  }
);

export default mongoose.model("PetHandOverInvitation", PetHandOverInvitationSchema);