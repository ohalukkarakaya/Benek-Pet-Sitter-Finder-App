import mongoose from "mongoose";

const PaymentDataSchema = new mongoose.Schema(
  {
      paymentUniqueCode: {
        type: String,
        required: true,
      },
      subSellerId: {
        type: String,
        required: true,
      },
      customerId: {
        type: String,
        required: true,
      },
      subSellerGuid: {
        type: String,
        required: true,
      },
      priceData: {
        priceType: {
            type: String,
            enum: [ "TL", "USD", "EUR" ],
            default: "TL"
        },
        price: {
            type: Number,
            required: true,
        },
        extraTimeData: { type: String }
      },
      parentContentId:{
        type: String
      },
      productDesc: { type: String },
      type: {
        type: String,
        enum: [ "CareGive", "CareGiveExtension", "ExtraMission", "EventTicket", "Donation" ],
        required: true
      },
      isFromInvitation: {
        type: Boolean,
        default: false
      },
      threeDUrl: {
        type: String,
        required: true,
      },
      codeForHash: {
        type: String,
        required: true
      },
      isPaid: {
        type: Boolean,
        default: false
      },
      virtualPosOrderId: { type: String }
  },
  {
      timestamps: true
  }
);

export default mongoose.model( "PaymentData", PaymentDataSchema );