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
      priceUnit: {
        type: String,
        enum: [ "tl", "usd" ],
        default: "tl"
      },
      price: {
        type: Number,
        default: 0
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

export default mongoose.model("PetHandOverInvitation", PetHandOverInvitationSchema);