import mongoose from "mongoose";

const AdminPaymentCancellationSchema = new mongoose.Schema(
    {
        adminId: { type: String, required: true },
        releatedContentId: { type: String, required: true },
        SubSellerId: { type: String, required: true },
        paymentVirtualPosId: { type: String },
        paymentDataId: { type: String },
        CustomerId: { type: String, required: true },
        contentUrl: { type: String },
        reportDesc: {
          type: String,
          required: true,
          maxLength: [
              50,
              '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
          ],
        },
        adminDesc: {
            type: String,
            required: true,
            maxLength: [
                100,
                '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
            ],
        }
    },
    {
        timestamps: true
    }
  );

export default mongoose.model( "AdminPaymentCancellation", AdminPaymentCancellationSchema );