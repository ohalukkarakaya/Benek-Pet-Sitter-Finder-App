import User from "../../models/User.js";
import Pet from "../../models/Pet.js";
import CareGive from "../../models/CareGive/CareGive.js";

import getLightWeightUserInfoHelper from "../getLightWeightUserInfoHelper.js";
import getLightWeightPetInfoHelper from "../getLightWeightPetInfoHelper.js";
import getLightWeightCareGiveInfoHelper from "../getLightWeightCareGiveInfoHelper.js";
import getLightWeightMissionInfoHelper from "../getLightWeightMissionInfoHelper.js";

const prepareReportedMissionHelper = async ( reportList ) => {
    try{

        let preparedReportInfoList = [];

        for( let report of reportList ){
            let reportInfo;

            let reportingUserInfo;
            let careGiverInfo;
            let petOwnerInfo;
            let petInfo;
            let careGiveInfo;
            let missionInfo;

            const reportingUser = await User.findById( report.reportingUserId );
            if( !reportingUser ){
                reportingUserInfo = "User Not Found"
            }else{
                reportingUserInfo = getLightWeightUserInfoHelper( reportingUser );
            }

            const careGiver = await User.findById( report.careGiverId );
            if( !careGiver ){
                careGiverInfo = "User Not Found"
            }else{
                careGiverInfo = getLightWeightUserInfoHelper( careGiver ); 
            }

            const petOwner = await User.findById( report.petOwnerId );
            if( !petOwner ){
                petOwnerInfo = "User Not Found"
            }else{
                petOwnerInfo = getLightWeightUserInfoHelper( petOwner ); 
            }

            const pet = await Pet.findById( report.petId );
            if( !pet ){
                petInfo = "Pet Not Found"
            }else{
                petInfo = await getLightWeightPetInfoHelper( pet );
            }

            const careGive = await CareGive.findById( report.careGiveId );
            if( !careGive ){
                return {
                    error: true,
                    message: "CareGive Not Found"
                }
            }

            careGiveInfo = await getLightWeightCareGiveInfoHelper(
                careGiverInfo,
                petOwnerInfo,
                petInfo,
                0,
                careGive
            );

            const mission = careGive.missionCallender.filter(
                mission =>
                    mission._id.toString() === report.missionId.toString()
            )[0];
            missionInfo = getLightWeightMissionInfoHelper(
                mission,
                0,
                petInfo,
                petOwnerInfo,
                careGiverInfo
            );


            
            reportInfo = {
                reportId: report._id.toString(),
                reportDesc: report.reportDesc,
                reportOwner: reportingUserInfo,
                petOwner: petOwnerInfo,
                careGiver: careGiverInfo,
                pet: petInfo,
                careGive: careGiveInfo,
                mission: missionInfo,
                isExtraService: report.isExtraService,
                missionTimePassword: report.requiredPassword,
                isMissionAproved: report.isMissionAproved,
                videoUrl: report.videoUrl,
            }

            preparedReportInfoList.push( reportInfo );
        }

        return preparedReportInfoList;
    }catch( err ){
        console.log( "ERROR: prepareReportedMissionHelper - ", err );
    }
}

export default prepareReportedMissionHelper;