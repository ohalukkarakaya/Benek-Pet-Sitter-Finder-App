import ExpenseRecord from "../../models/PaymentData/ExpenseRecord.js";

// Helpers
import prepareExpenseRecordHelper from "../../utils/adminHelpers/prepareExpenseRecordHelper.js";

//  *                *         .                      *            .   *           .    *
//                                *                  *  .                .
//  *                *        .       *                ☾         *.             *.     .  *.   .
//      *           .       *                *                 .               *.        *   .
//     . getExpensePaperListController   *       .         * .                  .  

const getExpensePaperListController = async ( req, res ) => {
    try{
        const lastItemId = req.params.lastItemId || 'null';
        const limit = parseInt( req.params.limit ) || 10;

        const expenseDocumentFilter = {};
        if( lastItemId !== 'null' ){
            const lastItem = await ExpenseRecord.findById(lastItemId);
            if(lastItem){
                expenseDocumentFilter.createdAt = { $gt: lastItem.createdAt };
            }
        }
        const expenseRecordCount = await ExpenseRecord.countDocuments();
        let expenseRecordList = await ExpenseRecord.find( expenseDocumentFilter ).sort({ createdAt: 1 }).limit( limit ).lean();
        if( !expenseRecordList || expenseRecordList.length <= 0 ){
            return res.status( 404 )
                      .json({ error: false, message: "No Expense Record Found" })
        }

        let expenseRecordInfoList = await prepareExpenseRecordHelper( new Set( expenseRecordList.map( record => record._id ) ) );
        if( expenseRecordInfoList.error ){
            return res.status( 500 )
                      .json({ error: true, message: "Internal Server Error" });
        }

        expenseRecordInfoList = expenseRecordInfoList.data;

        return res.status( 200 )
                .json({
                    error: false,
                    message: "List Prepared Succesfully",
                    totalexpenseRecordCount: expenseRecordCount,
                    expenseRecordList: expenseRecordInfoList
                })

    }catch( err ){
        console.log( "ERROR: getExpensePaperListController - ", err );
        return res.status( 500 )
                  .json({ error: true, message: "Internal Server Error" });
    }
}

export default getExpensePaperListController;