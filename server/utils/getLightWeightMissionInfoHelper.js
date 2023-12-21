const getLightWeightMissionInfoHelper = ( 
    mission,
    careGiveRoleId,
    petInfo,
    careGiverInfo
) => {
    let missionContent;
    if( 
        mission.missionContent
        && mission.missionContent.videoUrl
    ){
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

    return missionInfo;
}

export default getLightWeightMissionInfoHelper;