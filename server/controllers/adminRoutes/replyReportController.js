import PaymentData from "../../models/PaymentData/PaymentData.js";
import ReportMission from "../../models/Report/ReportMission";
import AdminPaymentCancellation from "../../models/Report/AdminPaymentCancellation.js";

//  *                *         .                      *            .   *           .    *
//                                *                  *  .                .
//  *                *        .       *                ☾         *.             *.     .  *.   .
//      *           .       *                *                 .               *.        *   .
//     . getReportedMissionListController   *       .         * .                  .  

const replyReportController = async ( req, res ) => {
    try{
        const reportId = req.params.reportId.toString();
        let adminsResponseToReport = req.params.response.toString();
        const responseDesc = req.body.responseDesc.toString();

        if( !reportId || !adminsResponseToReport ){
            return res.status( 400 )
                      .json({ error: true, message: "Missing Param"})
        }

        adminsResponseToReport = adminsResponseToReport === 'True' || adminsResponseToReport === 'true';

        const report = ReportMission.findById( reportId );
        if( !report ){
            return res.status( 404 )
                      .json({ error: true, message: "Report Not Found" })
        }

        if( adminsResponseToReport ){
            if( !responseDesc ){
                return res.status( 400 )
                          .json({ error: true, message: "Missing Desc" })
            }
            
            // Punish CareGiver
            const paymentData = PaymentData.findOne({ parentContentId: report.careGiveId.toString() });
            await new AdminPaymentCancellation({ 
                adminId: req.user._id.toString(), 
                releatedContentId: report.careGiveId.toString(),
                SubSellerId: report.careGiverId.toString(),
                paymentVirtualPosId: paymentData.virtualPosOrderId.toString(),
                paymentDataId: paymentData._id.toString(),
                CustomerId: report.petOwnerId.toString(),
                contentUrl: report.videoUrl.toString(),
                reportDesc: report.reportDesc.toString(),
                adminDesc: req.body.responseDesc.toString()
            }).save();
        }

        await report.deleteOne();

        return res.status( 200 )
                  .json(
                    {
                        error: false,
                        message: "Reply Operation Made Succesfully"
                    }
                  );
    }catch( err ){
        console.log( "ERROR: replyReportController - ", err );
        return res.status( 500 )
                  .json({ error: true, message: "Internal Server Error" })
    }
}

export default replyReportController;