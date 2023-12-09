import InvoiceRecord from "../../models/PaymentData/InvoiceRecord.js";

//helpers
import prepareReportedMissionHelper from "../../utils/adminHelpers/prepareReportedMissionHelper.js";

//  *                *         .                      *            .   *           .    *
//                                *                  *  .                .
//  *                *        .       *                ☾         *.             *.     .  *.   .
//      *           .       *                *                 .               *.        *   .
//     . getInvoicePaperListController   *       .         * .                  .  

const getInvoicePaperListController = async ( req, res ) => {
    try{ 
        const skip = parseInt( req.params.skip ) || 0;
        const limit = parseInt( req.params.limit ) || 10;

        const invoiceRecords = await InvoiceRecord.find().skip( skip ).limit( limit ).lean();
        if( !invoiceRecords ){
            return res.status( 404 )
                      .json({ error: false, message: "No Invoice Record Found" })
        }

        let preparedInvoiceInfoList = await prepareInvoiceRecordHelper( invoiceRecords );
        if( preparedInvoiceInfoList.error ){
            return res.status( 500 )
                  .json({ error: true, message: "Internal Server Error" });
        }
        preparedInvoiceInfoList = preparedInvoiceInfoList.data;

        return res.status( 200 )
                  .json({
                    error: false,
                    message: "Invoice Data Prepared Succesfully",
                    invoiceInfoList: preparedInvoiceInfoList
                  });
    }catch( err ){
        console.log( "ERROR: getInvoicePaperListController - ", err );
        return res.status( 500 )
                  .json({ error: true, message: "Internal Server Error" });
    }
}

export default getInvoicePaperListController;