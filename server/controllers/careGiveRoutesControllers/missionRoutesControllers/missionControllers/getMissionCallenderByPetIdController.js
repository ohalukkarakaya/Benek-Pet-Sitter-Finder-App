import CareGive from "../../../../models/CareGive/CareGive.js";
import Pet from "../../../../models/Pet.js";
import User from "../../../../models/User.js";
import getLightWeightPetInfoHelper from "../../../../utils/getLightWeightPetInfoHelper.js";
import getLightWeightUserInfoHelper from "../../../../utils/getLightWeightUserInfoHelper.js";

const getMissionCallenderByPetIdController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const petId = req.params.petId.roString();
        const skip = parseInt( req.params.skip );
        const limit = parseInt( req.params.limit );

        if( !petId ){
            return res.statu( 400 ).json(
                {
                    error: true,
                    message: "Missing Params"
                }
            );
        }

        const pet = await Pet.findById( petId );
        if( !pet ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "Pet Not Found"
                }
            );
        }

        let careGiveQuery;
        const isAuthorizedForPet = pet.allOwners.includes( userId );
        if( isAuthorizedForPet ){
            careGiveQuery = {
                petId: petId
            }
        }else{
            careGiveQuery = {
                $and: [
                    { petId: petId },
                    { "careGiver.careGiverId": userId }
                ]
            }
        }
        
        const careGives = await CareGive.find( careGiveQuery );
        if(
            !careGives
            || careGives.length <= 0
        ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "No Mission Found For This Pet"
                }
            );
        }

        careGives.forEach(
            async ( careGive ) => {
                careGive.missionCallender.forEach(
                    async ( mission ) => {

                        const pet = await Pet.findById( careGive.petId.toString() );

                        const petInfo = getLightWeightPetInfoHelper( pet );
                
                        const petOwner = await User.findById( 
                                                        careGive.petOwner
                                                                .petOwnerId
                                                                .toString()
                                                    );
                
                        const careGiver = await User.findById( 
                                                        careGive.careGiver
                                                                .careGiverId
                                                                .toString()
                                                    );
                
                        const petOwnerInfo = getLightWeightUserInfoHelper( petOwner );
                
                        const careGiverInfo = getLightWeightUserInfoHelper( careGiver );

                        let careGiveRoleId;
                        if(
                            pet.allOwners
                            .includes( userId )
                        ){
                            careGiveRoleId = 1;
                        }else if( userId === careGiver._id.toString() ){
                            careGiveRoleId = 2;
                        }

                        let missionContent;
                        if( 
                            mission.missionContent
                                .videoUrl
                        ){
                            missionContent = {
                                videoUrl: mission.missionContent
                                                .videoUrl,
                                timeCode: mission.missionContent
                                                    .timeSignature
                                                    .timePassword,
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

                        mission = missionInfo;
                    }
                );

                careGive = careGive.missionCallender;
            }
        );

        const allMissions = [].concat(...careGives)
                              .sort(
                                 ( a, b ) => 
                                      b.date - a.date
                               );

        const startIndex = allMissions.length - skip - 1;
        const endIndex = startIndex + limit;

        const limitedMissionCallender = allMissions.slice( startIndex, endIndex );

        return res.status( 200 ).json(
            {
                error: false,
                message: "Pets Mission List Prepared Succesfully",
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

export default getMissionCallenderByPetIdController;