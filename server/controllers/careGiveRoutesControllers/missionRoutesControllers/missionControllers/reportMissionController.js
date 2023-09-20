import CareGive from "../../../../models/CareGive/CareGive.js";
import ReportMission from "../../../../models/Report/ReportMission.js";

import dotenv from "dotenv";

dotenv.config();

const reportMissionController = async (req, res) => {
    try{
        const careGiveId = req.params.careGiveId.toString();
        const missionId = req.params.missionId.toString();
        const reportDesc = req.body.reportDesc;

        if( !careGiveId || !missionId || !reportDesc ){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "Missing params"
                            }
                       );
        }

        const careGive = await CareGive.findById( careGiveId );
        if( !careGive ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "Care Give not found"
                            }
                       );
        }

        if(
            req.user._id.toString() !== careGive.careGiver.careGiverId.toString()
            && req.user._id.toString() !== careGive.petOwner.petOwnerId.toString()
        ){
            return res.status( 401 )
                      .json(
                            {
                                error: true,
                                message: "You are not authorized to report this mission"
                            }
                       );
        }

        const mission = careGive.missionCallender.find(
            missionObject =>
                missionObject._id.toString() === missionId
        );
        if( !mission ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "Mission not found"
                            }
                       );
        };

        const areThereReportAboutSameMission = await ReportMission.findOne(
                                                                     {
                                                                        careGiveId: careGive._id.toString(),
                                                                        missionId: mission._id.toString()
                                                                     }
                                                                   );
        if( areThereReportAboutSameMission ){
            return res.status( 400 )
                      .json(
                        {
                            error: true,
                            message: "This Mission is Already Reported"
                        }
                      );
        }

        const report = await new ReportMission(
            {
                reportingUserId: req.user._id.toString(),
                careGiveId: careGive._id.toString(),
                petOwnerId: careGive.petOwner.petOwnerId.toString(),
                petId: careGive.petId.toString(),
                careGiverId: careGive.careGiver.careGiverId.toString(),
                missionId: mission._id.toString(),
                missionDate: mission.missionDate,
                missionDesc: mission.missionDesc,
                isExtraService: mission.isExtra,
                requiredPassword: mission.missionContent.timeSignature.timePassword,
                videoUrl: mission.missionContent.videoUrl,
                isMissionAproved: mission.missionContent.isApproved,
                reportDesc: reportDesc
            }
        ).save();

        return res.status( 200 )
                          .json(
                                {
                                    error: false,
                                    message: `mission reported with the id: ${report._id.toString()}`
                                }
                           );
    }catch( err ){
        console.log( "ERROR: report mission", err );
        return res.status( 500 )
                  .json(
                        {
                            error: true,
                            message: "Internal server error"
                        }
                   );
    }
}

export default reportMissionController;