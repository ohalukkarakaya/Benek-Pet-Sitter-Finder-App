import mongoose from "mongoose";

const EventInvitationSchema = new mongoose.Schema(
  {
      eventAdminId: {
        type: String,
        required: true,
      },
      eventId: {
        type: String,
        required: true,
      },
      invitedId: {
        type: String,
        required: true,
      },
      ticketPrice: {
        priceType: {
            type: String,
            enum: [ "Free", "TL", "USD", "EUR" ],
            default: "Free"
        },
        price: {
            type: Number,
            default: 0,
        }
      },
      invitedAt: {
        type: Date,
        dafeult: Date.now()
      },
      eventDate: {
        type: Date,
        required: true
      },
      isPrivate: {
        type: Boolean,
        default: false
      }
  },
  {
      timestamps: true
  }
);

export default mongoose.model("EventInvitation", EventInvitationSchema);