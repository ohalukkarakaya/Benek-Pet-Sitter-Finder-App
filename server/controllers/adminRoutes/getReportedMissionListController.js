import ReportMission from "../../models/Report/ReportMission";

//helpers
import prepareReportedMissionHelper from "../../utils/adminHelpers/prepareReportedMissionHelper.js";

//  *                *         .                      *            .   *           .    *
//                                *                  *  .                .
//  *                *        .       *                ☾         *.             *.     .  *.   .
//      *           .       *                *                 .               *.        *   .
//     . getReportedMissionListController   *       .         * .                  .  

const getReportedMissionListController = async ( req, res ) => {
    try{
        const skip = parseInt( req.params.skip ) || 0;
        const limit = parseInt( req.params.limit ) || 15;

        let reportedMissions = await ReportMission.find().skip( skip ).limit( limit ).lean();

        let reportedMissionList = await prepareReportedMissionHelper( reportedMissions );
        if( !reportedMissionList || reportedMissionList.length <= 0 ){
            return res.status( 404 )
                      .json({ error: false, message: "No Reported Mission Found" })
        }

        return res.status( 200 )
                  .json({
                        error: false,
                        message: "List Prepared Succesfully",
                        reportedMissionList: reportedMissionList
                  });
    }catch( err ){
        console.log( "ERROR: getReportedMissionListController - ", err );
        return res.status( 500 )
                  .json({ error: true, message: "Internal Server Error" });
    }
}

export default getReportedMissionListController;