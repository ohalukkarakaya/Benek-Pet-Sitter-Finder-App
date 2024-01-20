import ReportMission from "../../models/Report/ReportMission.js";

//helpers
import prepareReportedMissionHelper from "../../utils/adminHelpers/prepareReportedMissionHelper.js";

//  *                *         .                      *            .   *           .    *
//                                *                  *  .                .
//  *                *        .       *                ☾         *.             *.     .  *.   .
//      *           .       *                *                 .               *.        *   .
//     . getReportedMissionListController   *       .         * .                  .  

const getReportedMissionListController = async ( req, res ) => {
    try{
        const lasItemId = req.params.lastItemId || 'null';
        const limit = parseInt( req.params.limit ) || 15;

        const reportedMissionFilter = {};
        if( lasItemId !== 'null' ){
            const lastItem = await ReportMission.findById(lasItemId);
            if(lastItem){
                reportedMissionFilter.createdAt = { $gt: lasItem.createdAt };
            }
            
        }

        const reportedMissionsCount = await ReportMission.countDocuments();
        let reportedMissions = await ReportMission.find( reportedMissionFilter ).sort({ createdAt: 1 }).limit( limit ).lean();

        let reportedMissionList = await prepareReportedMissionHelper( reportedMissions );
        if( !reportedMissionList || reportedMissionList.length <= 0 ){
            return res.status( 404 )
                      .json({ error: false, message: "No Reported Mission Found" })
        }

        return res.status( 200 )
                  .json({
                        error: false,
                        message: "List Prepared Succesfully",
                        reportedMissionCount: reportedMissionsCount,
                        reportedMissionList: reportedMissionList
                  });
    }catch( err ){
        console.log( "ERROR: getReportedMissionListController - ", err );
        return res.status( 500 )
                  .json({ error: true, message: "Internal Server Error" });
    }
}

export default getReportedMissionListController;