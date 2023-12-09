import User from "../../models/User.js";

// Helpers
import getLightWeightUserInfoHelper from "../getLightWeightUserInfoHelper";
import prepareExpenseRecordHelper from "./prepareExpenseRecordHelper.js";

const prepareInvoiceRecordHelper = async ( invoiveRecordList ) => {
    try{
        let preparedInvoiceRecordList = [];

        for( let invoiceRecord of invoiveRecordList ){
            const careGiver = await User.findById( invoiceRecord.careGiverId.toString() );
            if( !careGiver ){
                break;
            }
            const careGiverInfo = getLightWeightUserInfoHelper( careGiver );

            const customer = await User.findById( invoiceRecord.customerId.toString() );
            if( !customer ){
                break;
            }
            const customerInfo = getLightWeightUserInfoHelper( customer );

            let preparedExpensionInfoList = await prepareExpenseRecordHelper( invoiceRecord.connectedExpensionsIdsList );
            if( preparedExpensionInfoList.error ){
                return { error: true, message: "Internal Server Error" }
            }
            preparedExpensionInfoList = preparedExpensionInfoList.data;
            
            let expenseDocumentInfo = {
                careGiver: careGiverInfo,
                customer: customerInfo,
                priceData: invoiceRecord.priceData,
                connectedExpensionsList: preparedExpensionInfoList,
                invoicePdfDocumentUrl: invoiceRecord.invoicePdfDocumentUrl.toString()
            }

            preparedInvoiceRecordList.push( expenseDocumentInfo );
        }

        return { error: false, data: preparedInvoiceRecordList }
    }catch( err ){
        console.log( "ERROR: prepareInvoiceRecordHelper - ", err );
        return { error: true, message: "Internal Server Error" }
    }
}

export default prepareInvoiceRecordHelper;