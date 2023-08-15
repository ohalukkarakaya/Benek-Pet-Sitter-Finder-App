import { createRequire } from "module";

const require = createRequire(import.meta.url);
const rawPetDataset = require('../../../src/pet_dataset.json');
const petDataset = JSON.parse( JSON.stringify( rawPetDataset ) );

const getPetKeywordsController = async (req, res) => {
    try{
        const userLanguage = req.params.language;

        if(userLanguage === "tr"){
            const trResponse = [];
            for(
                var i = 0; 
                i < petDataset.pets
                              .length; 
                i ++
            ){
                var petGeneralId = petDataset.pets[ i ]
                                             .id;

                var petName = petDataset.pets[ i ]
                                        .name
                                        .tr;

                var petSpecies = [];
                for(
                    var index = 0; 
                    index < petDataset.pets[ i ]
                                      .species
                                      .length; 
                    index ++
                ){
                    var speciesId = petDataset.pets[ i ]
                                              .species[ index ]
                                              .id;

                    var speciesName = petDataset.pets[ i ]
                                                .species[ index ]
                                                .tr;

                    var speciesObject = {
                        "id": speciesId,
                        "name": speciesName, 
                    };
                    petSpecies.push( speciesObject );
                }

                var trResponseObject = {
                    "id": petGeneralId,
                    "pet": petName,
                    "species": petSpecies
                };
                trResponse.push( trResponseObject );
            }

            return res.status( 200 )
                      .json(
                          {
                              trResponse
                          }
                      );
        }else{
            const enResponse = [];
            for(
                var i = 0; 
                i < petDataset.pets
                              .length; 
                i ++
            ){
                var petGeneralId = petDataset.pets[ i ].id;
                var petName = petDataset.pets[i].name.en;

                var petSpecies = [];
                for(
                    var index = 0; 
                    index < petDataset.pets[ i ]
                                      .species
                                      .length; 
                    index ++
                ){
                    var speciesId = petDataset.pets[ i ]
                                              .species[ index ]
                                              .id;

                    var speciesName = petDataset.pets[ i ]
                                                .species[ index ]
                                                .en;

                    var speciesObject = {
                        "id": speciesId,
                        "name": speciesName, 
                    };
                    petSpecies.push(speciesObject);
                }

                var trResponseObject = {
                    "id": petGeneralId,
                    "pet": petName,
                    "species": petSpecies
                };
                enResponse.push( trResponseObject );
            }

            return res.status( 200 )
                      .json(
                            {
                                enResponse
                            }
                      );
        }
    }catch( err ){
        console.log( "ERROR: getPetKeywordsController - ", err );
        res.status( 500 )
           .json(
            {
                error: true,
                message: "Internal Server Error"
            }
           );
      }
}

export default getPetKeywordsController;