import mongoose from "mongoose";

const CareGiveSchema = new mongoose.Schema(
  {
      invitation: {
        careGiverPosGuid: { type: String },
        from: { type: String, required: true },
        to: { type: String, required: true, },
        at: { type: Date, default: Date.now() },
        isAccepted: { type: Boolean, default: false },
        actionCode: {
            codeType: { type: String, enum: [ "Start", "Finish", "Done" ] },
            codePassword: { type: String },
            code: { type: String }
        }
      },
      isStarted: { type: Boolean, default: false },
      finishProcess: {
        isFinished: { type: Boolean, default: false, },
        finishDate: Date
      },
      petId: { type: String, required: true },
      careGiver: {
        careGiverId: { type: String },
        careGiverContact: {
            careGiverPhone: { type: String },
            careGiverEmail: { type: String }
        }
      },
      petOwner: {
        petOwnerId: { type: String },
        petOwnerContact: {
            petOwnerEmail: { type: String },
            petOwnerPhone: { type: String, }
        }
      },
      prices: {
        priceType: { type: String, enum: [ "Free", "TL", "USD", "EUR" ], default: "Free" },
        servicePrice: { type: Number, default: 0, },
        orderInfo : {
            paymentId: { type: String },
            orderId: { type: String, },
            orderUniqueCode: { type: String }
        },
        extraMissionPrice: { type: Number, default: 0, },
        maxMissionCount: { type: Number, default: 0, },
        boughtExtra: { type: Number, default: 0, }
      },
      startDate: { type: Date, default: Date.now() },
      endDate: {
          type: Date,
          default: () => Date.now() + 7*24*60*60*1000,
          validate: [
              function (value) {
                  if (!this.startDate) return true;
                  const startDate = Date.parse(this.startDate);
                  return startDate < Date.parse(value);
              },
              "endDate must be after startDate"
          ]
      },
      adress: {
        adressDesc: { type: String, maxLength: [ 100, '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır' ], },
        lat: { type: String, required: true, },
        long: { type: String, required: true }
      },
      missionCallender: [
        { 
            missionDesc: { type: String, maxLength: [ 150, '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır' ], },
            missionDate: { type: Date, required: true },
            missionDeadline: {
                type: Date,
                required: true,
                validate: [
                    function (value) {
                        if (!this.missionDate || !value) return false;
                        const startDate = new Date(this.missionDate);
                        const endDate = new Date(value);
                        if (isNaN(startDate) || isNaN(endDate)) return false;
                        return startDate < endDate;
                    },
                    "Invalid missionDeadline"
                ]
            },
            isExtra: { type: Boolean, default: false },
            extraMissionInfo: {
                paymentDataId: { type: String },
                orderUniqueCode: { type: String },
                sanalPosIslemId: { type: String },
                subSellerGuid: { type: String },
                paidPrice: { type: String }
            },
            missionContent:{
                timeSignature: {
                    timePassword: { type: String },
                    expiresAt: { type: Date, default: Date.now() + 10 * 60 * 1000 }
                },
                videoUrl: { type: String },
                isApproved: { type: Boolean, default: false }
            },
            createdAt: { type: Date, default: Date.now }
        }
      ]
  },
  {
      timestamps: true
  }
);

export default mongoose.model("CareGive", CareGiveSchema);