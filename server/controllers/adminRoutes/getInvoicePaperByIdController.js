import InvoiceRecord from "../../models/PaymentData/InvoiceRecord.js";

// Helpers
import prepareInvoiceRecordHelper from "../../utils/adminHelpers/prepareInvoiceRecordHelper.js";

//  *                *         .                      *            .   *           .    *
//                                *                  *  .                .
//  *                *        .       *                ☾         *.             *.     .  *.   .
//      *           .       *                *                 .               *.        *   .
//     . getInvoicePaperByIdController   *       .         * .                  .  

const getInvoicePaperByIdController = async ( req, res ) => {
    try{
        const invoiceId = req.params.invoiceId.toString();
        if( !invoiceId ){
            return res.status( 400 )
                      .json({ error: true, message: "Missing Params" });
        }
    
        const invoiceRecord = await InvoiceRecord.findById( invoiceId );
        if( !invoiceRecord ){
            return res.status( 404 )
                      .json({ error: true, message: "Invoice Record Not Found" });
        }

        let preparedInvoiceInfo = await prepareInvoiceRecordHelper([ invoiceRecord ]);
        if( preparedInvoiceInfo.error ){
            return res.status( 500 )
                  .json({ error: true, message: "Internal Server Error" });
        }
        preparedInvoiceInfo = preparedInvoiceInfo.data;

        return res.status( 200 )
                  .json({
                    error: false,
                    invoiceDocumentData: preparedInvoiceInfo
                  });
    }catch( err ){
        console.log( "ERROR: getInvoicePaperByIdController - ", err );
        return res.status( 500 )
                  .json({ error: true, message: "Internal Server Error" });
    }
}

export default getInvoicePaperByIdController;