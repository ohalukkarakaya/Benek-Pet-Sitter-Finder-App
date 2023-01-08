import mongoose from "mongoose";

const DeletedUserRefundSchema = new mongoose.Schema(
  {
      email: {
        type: String,
        required: true
      },
      refundPrice: {
        priceType: {
            type: String,
            enum: [ "TL", "USD", "EUR" ],
            default: "TL"
        },
        price: {
            type: Number,
            default: 0,
        }
      },
      profileDeletedAt: {
        type: Date,
        dafeult: Date.now()
      },
      expiryDate: {
        type: Date,
        default: Date.now() + 365 * 24 * 60 * 60 * 1000
      }
  },
  {
      timestamps: true
  }
);

export default mongoose.model("DeletedUserRefund", DeletedUserRefundSchema);