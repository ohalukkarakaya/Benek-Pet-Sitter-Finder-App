const getLightWeightPetInfoHelper = ( pet ) => {
    try{
        return {
            petId: pet._id
                      .toString(),
            petProfileImgUrl: pet.petProfileImg
                                 .imgUrl,
            petName: pet.name,
            sex: pet.sex,
            birthDay: pet.birthDay,
            kind: pet.kind,
            species: pet.species,
            handoverCount: pet.handOverRecord
                              .length
        };
    }catch( err ){
        console.log( "ERROR: user lightweight info - ", err );
        return err;
    }
}

export default getLightWeightPetInfoHelper;