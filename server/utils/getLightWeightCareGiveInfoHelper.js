
const getLightWeightCareGiveInfoHelper = async (
    careGiverInfo,
    petOwnerInfo,
    petInfo,
    careGiveRoleId,
    careGive
) => {
    let code;
    if( 
        (
            careGive.invitation.actionCode.codeType === "Start"
            && careGiveRoleId === 1
        )
        || (
            careGive.invitation.actionCode.codeType === "Finish"
            && careGiveRoleId === 2
        )
    ){
        code = {
            codeType: careGive.invitation.actionCode.codeType,
            code: careGive.invitation.actionCode.code
        };
    }

    let price;
    if( careGive.prices.priceType !== "Free" ){
        price = `${ careGive.prices.servicePrice } ${  careGive.prices.priceType }`;
    }else{
        price = careGive.prices.priceType;
    }

    const careGiveInfo = {
        id: careGive._id.toString(),
        careGiveRoleId: careGiveRoleId,
        careGiverContact: careGive.careGiver.careGiverContact,
        petOwnerContact: careGive.petOwner.petOwnerContact,
        careGiver: careGiverInfo,
        petOwner: petOwnerInfo,
        pet: petInfo,
        startDate: careGive.startDate,
        endDate: careGive.endDate,
        adress: careGive.adress,
        actionCode: code,
        isStarted: careGive.isStarted,
        isFinished: careGive.finishProcess.isFinished,
        finishDate: careGive.finishProcess.finishDate,
        price: price,
        missionCount: careGive.missionCallender.length
    }

    return careGiveInfo;
}

return getLightWeightCareGiveInfoHelper;