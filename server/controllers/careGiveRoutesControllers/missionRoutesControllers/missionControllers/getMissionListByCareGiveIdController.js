import CareGive from "../../../../models/CareGive/CareGive.js";
import Pet from "../../../../models/Pet.js";
import User from "../../../../models/User.js";
import getLightWeightPetInfoHelper from "../../../../utils/getLightWeightPetInfoHelper.js";
import getLightWeightUserInfoHelper from "../../../../utils/getLightWeightUserInfoHelper.js";

const getMissionListByCareGiveIdController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const careGiveId = req.params.careGiveId.toString();
        const lastItemId = req.params.lastItemId || 'null';
        const limit = parseInt( req.params.limit ) || 15;

        if( !careGiveId ){
            return res.status( 400 ).json({
                error: true,
                message: "Missing Params"
            });
        }

        const careGive = await CareGive.findById( careGiveId ).lean();
        if( !careGive ){
            return res.status( 404 ).json({
                error: true,
                message: "CareGive Not Found"
            });
        }

        const pet = await Pet.findById( careGive.petId.toString() ).lean();
        if( !pet ){
            return res.status( 404 ).json({
                error: true,
                message: "Pet Not Found"
            });
        }

        if(
            !( pet.allOwners.includes( userId ) )
            && careGive.careGiver.careGiverId !== userId
        ){
            return res.statu( 401 ).json({
                error: true,
                message: "UnAuthorized"
            });
        }

        const missionCallender = careGive.missionCallender;
        if( missionCallender.length <= 0 ){
            return res.status( 404 ).json({
                error: true,
                messae: "No Mission Found In This CareGive"
            });
        }

        const startIndex = lastItemId === 'null' ? 0 : missionCallender.findIndex( mission => mission._id.toString() === lastItemId ) + 1;
        const endIndex = startIndex + limit;

        const petInfo = getLightWeightPetInfoHelper( pet );

        const petOwner = await User.findById( careGive.petOwner.petOwnerId.toString());
        const careGiver = await User.findById( careGive.careGiver.careGiverId.toString() );

        const petOwnerInfo = getLightWeightUserInfoHelper( petOwner );
        const careGiverInfo = getLightWeightUserInfoHelper( careGiver );

        let careGiveRoleId;
        if( pet.allOwners.includes( userId ) ){
            careGiveRoleId = 1;
        }else if( userId === careGiver._id.toString() ){
            careGiveRoleId = 2;
        }



        const limitedMissionCallender = missionCallender.slice( startIndex, endIndex );
        let missionList = [];
        for( let mission of limitedMissionCallender ){
            let missionContent;
            if( mission.missionContent && mission.missionContent.videoUrl ){
                missionContent = {
                    videoUrl: mission.missionContent.videoUrl,
                    timeCode: mission.missionContent.timeSignature.timePassword,
                }
            }

            const missionInfo = {
                id: mission._id.toString(),
                roleId: careGiveRoleId,
                pet: petInfo,
                careGiver: careGiverInfo,
                petOwner: petOwnerInfo,
                desc: mission.missionDesc,
                date: mission.missionDate,
                deadline: mission.missionDeadline,
                isExtra: mission.isExtra,
                content: missionContent,
            }

            missionList.push( missionInfo );
        }

        return res.status( 200 ).json({
                error: true,
                message: "Mission List prepared succesfully",
                totalMissionCount: missionCallender.length,
                missions: missionList
            });
    }catch( err ){
        console.log("ERROR: getFinishedCareGiveListController - ", err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default getMissionListByCareGiveIdController;