const getLightWeightPetInfoHelper = ( pet ) => {
    try{
        return {
            id: pet._id.toString(),
            isDefaultImg: pet.petProfileImg.isDefaultImg,
            petProfileImg: pet.petProfileImg && pet.petProfileImg.imgUrl ? pet.petProfileImg.imgUrl : pet.defaultImage,
            name: pet.name,
            sex: pet.sex,
            birthDay: pet.birthDay,
            kind: pet.kind,
            species: pet.species,
            handoverCount: pet.handOverRecord ? pet.handOverRecord.length : 0
        };
    }catch( err ){
        console.log( "ERROR: user lightweight info - ", err );
        return err;
    }
}

export default getLightWeightPetInfoHelper;