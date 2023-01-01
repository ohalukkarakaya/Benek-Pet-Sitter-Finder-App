import mongoose from "mongoose";

const ReportedMissionsSchema = new mongoose.Schema(
  {
      reportingUserId: {
        type: String,
        required: true,
      },
      careGiveId: {
        type: String,
        required: true,
      },
      petOwnerId: {
        type: String,
        required: true,
      },
      petId: {
        type: String,
        required: true,
      },
      careGiverId: {
        type: String,
        required: true,
      },
      missionId: {
        type: String,
        required: true,
      },
      missionDate: {
        type: Date,
        required: true,
      },
      missionDesc: {
        type: String,
        required: true,
      },
      isExtraService: {
        type: Boolean,
        required: true
      },
      requiredPassword: {
        type: String,
      },
      videoUrl: {
        type: String,
      },
      isMissionAproved: {
        type: Boolean,
        required: true
      },
      reportDesc: {
        type: String,
        required: true,
        maxLength: [
            50,
            '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
        ],
      }
  },
  {
      timestamps: true
  }
);

export default mongoose.model("ReportMission", ReportedMissionsSchema);