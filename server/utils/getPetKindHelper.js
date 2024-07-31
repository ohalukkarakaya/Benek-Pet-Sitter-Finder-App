import { createRequire } from "module";

const require = createRequire(import.meta.url);
const rawPetDataset = require('../src/pet_dataset.json');
const petDataset = JSON.parse( JSON.stringify( rawPetDataset ) );

const getPetKindHelper = ( petKindId, SpeciesId ) => {
    try{
        const petKind = petDataset.pets.find( pet => pet.id === petKindId );
        return petKind.species.find( species => species.id === SpeciesId );
    }catch( err ){
        console.log( "ERROR: getPetKindHelper - ", err );
        return err;
    }
}

export default getPetKindHelper;