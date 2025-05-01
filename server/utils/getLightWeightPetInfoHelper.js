import User from "../models/User.js";

import getPetKindHelper from "./getPetKindHelper.js";
import getLightWeightUserInfoHelper from "./getLightWeightUserInfoHelper.js";

const getLightWeightPetInfoHelper = async ( pet ) => {
    try{
        return {
            id: pet._id.toString(),
            isDefaultImg: pet.petProfileImg.isDefaultImg,
            petProfileImg: pet.petProfileImg && pet.petProfileImg.imgUrl ? pet.petProfileImg.imgUrl : pet.defaultImage,
            name: pet.name,
            bio: pet.bio,
            sex: pet.sex,
            birthDay: pet.birthDay,
            kind: getPetKindHelper( pet.kind, pet.species ),
            species: pet.species,
            handoverCount: pet.handOverRecord ? pet.handOverRecord.length : 0,
            primaryOwner: getLightWeightUserInfoHelper( await User.findById( pet.primaryOwner.toString() ) ),
            allOwners: await Promise.all(
                pet.allOwners.map(async owner => {
                    const ownerInfo = await User.findById(owner.toString());
                    return getLightWeightUserInfoHelper(ownerInfo);
                })
            )
        };
    }catch( err ){
        console.log( "ERROR: user lightweight info - ", err );
        return err;
    }
}

export default getLightWeightPetInfoHelper;