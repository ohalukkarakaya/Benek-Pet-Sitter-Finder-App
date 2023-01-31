import mongoose from "mongoose";

const PaymentDataSchema = new mongoose.Schema(
  {
      from: {
          type: String,
          required: true,
      },
      to: {
        type: String,
        required: true,
      },
      for: {
          type: String,
          required: true,
          maxLength: [
            10,
            '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
        ],
      },
      price: {
          unit: {
            type: Number,
            required: true
          },
          expectedPrice: {
            type: Number,
            require: true
          },
          priceType: {
            type: String,
            default: "TL"
          }
      },
      date: {
          type: Date,
          required: true
      },
      isCanceled: {
        type: Boolean,
        default: false
      },
      isPaid: {
        type: Boolean,
        default: false
      }
  },
  {
      timestamps: true
  }
);

export default mongoose.model("PaymentData", PaymentDataSchema);