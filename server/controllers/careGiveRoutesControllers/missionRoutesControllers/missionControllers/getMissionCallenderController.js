import CareGive from "../../../../models/CareGive/CareGive.js";
import Pet from "../../../../models/Pet.js";
import User from "../../../../models/User.js";

import getLightWeightPetInfoHelper from "../../../../utils/getLightWeightPetInfoHelper.js";
import getLightWeightUserInfoHelper from "../../../../utils/getLightWeightUserInfoHelper.js";

const getMissionCallenderController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const skip = parseInt( req.params.skip ) || 0;
        const limit = parseInt( req.params.limit ) || 15;

        const releatedPetList = await Pet.find({ allOwners: { $in: [ userId ] }}).lean();
        const releatedPets = releatedPetList.map( pet => pet._id.toString() );

        var careGiveList = await CareGive.find(
            {
                $or: [
                    { petId: { $in: releatedPets } },
                    { "invitation.from": userId },
                    { "invitation.to": userId },
                    { "careGiver.careGiverId": userId },
                    { "petOwner.petOwnerId": userId }
                ]
            }
        ).lean();

        if(
            !careGiveList
            || careGiveList.length <= 0
        ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "No Mission Found For This Pet"
                }
            );
        }

        let missionCallendersList = [];
        for(
            let careGive
            of careGiveList
        ){
            let missionList = [];
            for(
                let mission
                of careGive.missionCallender
            ){
                const pet = await Pet.findById( careGive.petId.toString() );
                const petInfo = getLightWeightPetInfoHelper( pet );

                const petOwner = await User.findById( careGive.petOwner.petOwnerId.toString() );
                const petOwnerInfo = getLightWeightUserInfoHelper( petOwner );

                const careGiver = await User.findById( careGive.careGiver.careGiverId.toString() );
                const careGiverInfo = getLightWeightUserInfoHelper( careGiver );

                let careGiveRoleId;
                if( pet.allOwners.includes( userId ) ){
                    careGiveRoleId = 1;
                }else if( userId === careGiver._id.toString() ){
                    careGiveRoleId = 2;
                }

                let missionContent;
                if( mission.missionContent.videoUrl ){
                    missionContent = {
                        videoUrl: mission.missionContent.videoUrl,
                        timeCode: mission.missionContent.timeSignature.timePassword,
                    }
                }

                const missionInfo = {
                    id: mission._id.toString(),
                    careGiveId: careGive._id.toString(),
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

                if( missionInfo ){
                    missionList.push( missionInfo );
                }
            }

            if( missionList.length > 0 ){
                missionCallendersList = missionCallendersList.concat(...missionList);
            }
        }

        const allMissions = [].concat(...missionCallendersList)
                              .sort(
                                 ( a, b ) => 
                                      b.date - a.date
                               );

        const startIndex = skip > 0
                            ? skip - 1
                            : skip;
                            
        const endIndex = startIndex + limit;

        const limitedMissionCallender = allMissions.slice( startIndex, endIndex );

        return res.status( 200 ).json(
            {
                error: false,
                message: "Mission List Prepared Succesfully",
                totalMissionCount: allMissions.length,
                missions: limitedMissionCallender
            }
        );
        
    }catch( err ){
        console.log("ERROR: getMissionCallenderController - ", err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default getMissionCallenderController;