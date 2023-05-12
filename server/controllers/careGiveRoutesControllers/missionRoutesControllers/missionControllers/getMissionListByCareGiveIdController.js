import CareGive from "../../../../models/CareGive/CareGive.js";
import Pet from "../../../../models/Pet.js";
import User from "../../../../models/User.js";

const getMissionListByCareGiveIdController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const careGiveId = req.params.careGiveId.roString();
        const skip = parseInt( req.params.skip ) || 0;
        const limit = parseInt( req.params.limit ) || 15;

        if( !careGiveId ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "Missing Params"
                }
            );
        }

        const careGive = await CareGive.findById( careGiveId );
        if( !careGive ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "CareGive Not Found"
                }
            );
        }

        const pet = await Pet.findById( careGive.petId.toString() );
        if( !pet ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "Pet Not Found"
                }
            );
        }

        if(
            !(
                pet.allOwners
                   .includes( userId )
            )

            && careGive.careGiver
                       .careGiverId !== userId
        ){
            return res.statu( 401 ).json(
                {
                    error: true,
                    message: "UnAuthorized"
                }
            );
        }

        const missionCallender = careGive.missionCallender;
        if( missionCallender.length <= 0 ){
            return res.status( 404 ).json(
                {
                    error: true,
                    messae: "No Mission Found In This CareGive"
                }
            );
        }

        const startIndex = missionCallender.length - skip - 1;
        const endIndex = startIndex + limit;

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



        const limitedMissionCallender = missionCallender.slice( startIndex, endIndex );
        limitedMissionCallender.forEach(
            async ( mission ) => {
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

        return res.status( 200 ).json(
            {
                error: true,
                message: "Mission List prepared succesfully",
                totalMissionCount: missionCallender.length,
                missions: missionInfo
            }
        );

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