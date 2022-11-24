import express from "express";
import fs from "fs";
import AnimalCategories from "../../models/AnimalCategories.js";
import { animalCategoryReqValidation } from "../../utils/animalCategoryReqValidationSchema.js";
import auth from "../../middleware/auth.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const rawPetDataset = require('../../src/pet_dataset.json');

const petDataset = JSON.parse(JSON.stringify(rawPetDataset));

const router = express.Router();

//Send Pet Keywords
router.get(
    "/:language",
    auth,
    async (req, res) => {
    
    // let rawPetDataset = fs.readFile(
    //     '../../src/pet_dataset.json',
    //     "utf8",
    //     (err, data) => {
    //         if(err){
    //             return res.status(500).json(
    //                 {
    //                     error: true,
    //                     message: err.message
    //                 }
    //             );
    //         };
    //         console.log(data);
    //     }
    // );
    // let petDataset = JSON.parse(rawPetDataset);

    const userLanguage = req.params.language;

    if(userLanguage === "tr"){
        const trResponse = [];
        for(var i = 0; i < petDataset.pets.length; i ++){
            var petGeneralId = petDataset.pets[i].id;
            var petName = petDataset.pets[i].name.tr;

            var petSpecies = [];
            for(var index = 0; index < petDataset.pets[i].species.length; index ++){
                var speciesId = petDataset.pets[i].species[index].id;
                var speciesName = petDataset.pets[i].species[index].tr;

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
            trResponse.push(trResponseObject);
        }

        return res.status(200).json(
            {
                trResponse
            }
        );
    }else{
        const enResponse = [];
        for(var pet in petDataset.pets){
            var petGeneralId = pet.id;
            var petName = pet.name.en;

            var petSpecies = [];
            for(var species in pet.species){
                var speciesId = species.id;
                var speciesName = species.en;

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
            enResponse.push(trResponseObject);
        }

        return res.status(200).json(
            {
                enResponse
            }
        );
    }
});

  export default router;