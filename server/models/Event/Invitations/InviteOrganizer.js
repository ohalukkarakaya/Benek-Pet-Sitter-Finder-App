import mongoose from "mongoose";

const EventOrganizerInvitationSchema = new mongoose.Schema(
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
      invitedAt: {
        type: Date,
        dafeult: Date.now()
      },
      eventDate: {
        type: Date,
        required: true
      }
  },
  {
      timestamps: true
  }
);

export default mongoose.model("EventOrganizerInvitation", EventOrganizerInvitationSchema);