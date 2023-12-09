import prepareExpenseRecordHelper from "../../utils/adminHelpers/prepareExpenseRecordHelper.js";

//  *                *         .                      *            .   *           .    *
//                                *                  *  .                .
//  *                *        .       *                ☾         *.             *.     .  *.   .
//      *           .       *                *                 .               *.        *   .
//     . getExpensePaperByIdController   *       .         * .                  .  

const getExpensePaperByIdController = async ( req, res ) => {
    try{
        const expenseRecordId = req.params.expenseId.toString();
        if( !expenseRecordId ){
            return res.status( 400 )
                      .json({ error: true, message: "Missing Param" });
        }

        let expenseDocumentInfo = await prepareExpenseRecordHelper([ expenseRecordId ]);
        if( expenseDocumentInfo.error ){
            return res.status( 500 )
                      .json({ error: true, message: "Internal Server Error" });
        }
        expenseDocumentInfo = expenseDocumentInfo.data;

        return res.status( 200 )
                  .json({
                    error: false,
                    message: "Expense Record Prepared Succesfully",
                    expenseDocumentInfo: expenseDocumentInfo
                  });

    }catch( err ){
        console.log( "ERROR: getExpensePaperByIdController - ", err );
        return res.status( 500 )
                  .json({ error: true, message: "Internal Server Error" });
    }
}

export default getExpensePaperByIdController;