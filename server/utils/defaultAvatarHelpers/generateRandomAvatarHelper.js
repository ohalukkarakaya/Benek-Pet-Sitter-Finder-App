import { backGroundIdiesList, avatarIdiesList } from "./avatarAssetIdiesLists.js";

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateRandomAvatarHelper = () => {
    const backGroundMaxIndex = getRandomNumber(0, backGroundIdiesList.length - 1);
    const avatarMaxIndex = getRandomNumber(0, avatarIdiesList.length - 1);
    const backGroundId = backGroundIdiesList[backGroundMaxIndex];
    const avatarId = avatarIdiesList[avatarMaxIndex];
    return {
        "backGroundId": backGroundId,
        "avatarId": avatarId
    };
}

export default generateRandomAvatarHelper;