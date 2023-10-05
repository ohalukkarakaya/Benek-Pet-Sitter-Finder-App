import ReportMission from "../../models/Report/ReportMission";

const getReportedMissionByIdController = async( req, res ) => {
    try{
        const reportId = req.params.reportId.toString();
        if( !reportId ){
            return res.status( 500 ).json({ error: true, message: "Missing Params" });
        }

        const report = await ReportMission.findById({ reportId });
        if( !report ){
            return res.status( 404 ).json({ error: true, message: "Report Not Found" });
        }

        
    }catch( err ){
        console.log( "ERROR: getReportedMissionByIdController - ", err );
        return res.status( 500 ).json({ error: true, message: "Internal Server Error" });
    }
}

export default getReportedMissionByIdController;