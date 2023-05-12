import CareGive from "../../../../models/CareGive/CareGive.js";
import Pet from "../../../../models/Pet.js";
import User from "../../../../models/User.js";

const getMissionCallenderController = async ( req, res ) => {
    try{
        const userId = req.user_id.toString();
        const skip = parseInt( req.params.skip ) || 0;
        const limit = parseInt( req.params.limit ) || 15;

        const releatedPetList = await Pet.find(
            {
                allOwners: { $in: [ userId ] }
            }
        );
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
        );

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

        careGiveList.forEach(
            async ( careGive ) => {
                careGive.missionCallender.forEach(
                    async ( mission ) => {

                        const pet = await Pet.findById( careGive.petId.toString() );

                        const petInfo = {
                            petId: pet._id.toString(),
                            petProfileImgUrl: pet.petProfileImg
                                                 .imgUrl,
                            petName: pet.name,
                            sex: pet.sex,
                            birthDay: pet.birthDay,
                            kind: pet.kind,
                            species: pet.species,
                            handoverCount: pet.handOverRecord
                                              .length
                        }
                
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
                
                        const petOwnerInfo = {
                
                            userId: petOwner._id
                                            .toString(),
                            userProfileImg: petOwner.profileImg
                                                    .imgUrl,
                            username: petOwner.userName,
                            userFullName: `${
                                    petOwner.identity
                                            .firstName
                                } ${
                                    petOwner.identity
                                            .middleName
                                } ${
                                    petOwner.identity
                                            .lastName
                                }`.replaceAll( "  ", " "),
                            contact: careGive.petOwner.petOwnerContact
                        }
                
                        const careGiverInfo = {
                
                            userId: careGiver._id
                                            .toString(),
                            userProfileImg: careGiver.profileImg
                                                     .imgUrl,
                            username: careGiver.userName,
                            userFullName: `${
                                    careGiver.identity
                                             .firstName
                                } ${
                                    careGiver.identity
                                             .middleName
                                } ${
                                    careGiver.identity
                                             .lastName
                                }`.replaceAll( "  ", " "),
                            contact: careGive.careGiver.careGiverContact
                        }

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

        const allMissions = [].concat(...careGiveList)
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