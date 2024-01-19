import { backGroundIdiesList, avatarIdiesList, petAvatarIdList } from "./avatarAssetIdiesLists.js";

function getRandomNumber( min, max ){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateRandomAvatarHelper = ( isPetAvatar ) => {
    const backGroundIndex = getRandomNumber(0, backGroundIdiesList.length - 1);
    const avatarIndex = isPetAvatar ? getRandomNumber(0, petAvatarIdList.length - 1) : getRandomNumber(0, avatarIdiesList.length - 1);
    const backGroundId = backGroundIdiesList[backGroundIndex];
    const avatarId = isPetAvatar ? petAvatarIdList[avatarIndex] : avatarIdiesList[avatarIndex];
    return {
        "backGroundId": backGroundId,
        "avatarId": avatarId
    };
}

export default generateRandomAvatarHelper;