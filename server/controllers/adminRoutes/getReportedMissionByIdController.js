import ReportMission from "../../models/Report/ReportMission.js";

//helpers
import prepareReportedMissionHelper from "../../utils/adminHelpers/prepareReportedMissionHelper.js";

import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

//  *                *         .                      *            .   *           .    *
//                                *                  *  .                .
//  *                *        .       *                ☾         *.             *.     .  *.   .
//      *           .       *                *                 .               *.        *   .
//     . getReportedMissionByIdController   *       .         * .                  .  

const getReportedMissionByIdController = async( req, res ) => {
    try{
        const reportId = req.params.reportId.toString();
        if( !reportId ){
            return res.status( 500 ).json({ error: true, message: "Missing Params" });
        }

        const report = await ReportMission.findById( reportId );
        if( !report ){
            return res.status( 404 ).json({ error: true, message: "Report Not Found" });
        }

        const reportInfo = await prepareReportedMissionHelper([ report ]);

        return res.status( 200 )
                  .json(
                    {
                        error: false,
                        message: "Misson Data Prepared Successfuly",
                        report: reportInfo[ 0 ]
                    }
                  );
                  
    }catch( err ){
        console.log( "ERROR: getReportedMissionByIdController - ", err );
        return res.status( 500 ).json({ error: true, message: "Internal Server Error" });
    }
}

export default getReportedMissionByIdController;