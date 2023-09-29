import mongoose from "mongoose";

const ExpenseRecordSchema = new mongoose.Schema(
  {
      careGiverId: {
        type: String,
        required: true,
      },
      customerId: {
        type: String,
        required: true,
      },
      careGiverGuid: {
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
      expensePdfDocumentUrl: { type: String }
  },
  {
      timestamps: true
  }
);

export default mongoose.model( "ExpenseRecord", ExpenseRecordSchema );