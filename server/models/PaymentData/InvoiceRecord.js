import mongoose from "mongoose";

const InvoiceRecordSchema = new mongoose.Schema(
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
        type: Number,
        required: true,
      },
      connectedExpensionsIdsList:[],
      invoicePdfDocumentUrl: { type: String }
  },
  {
      timestamps: true
  }
);

export default mongoose.model( "InvoiceRecord", InvoiceRecordSchema );