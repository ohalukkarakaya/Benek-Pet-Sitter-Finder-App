import express from "express";
import fs from "fs";
import AnimalCategories from "../../models/AnimalCategories.js";
import { animalCategoryReqValidation } from "../../utils/animalCategoryReqValidationSchema.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

//Send Pet Keywords
router.get(
    "/:language",
    auth,
    async (req, res) => {
    
    let rawPetDataset = fs.readFile(
        '../../src/petDataset.json',
        "utf8",
        (err, data) => {
            if(err){
                return res.status(500).json(
                    {
                        error: true,
                        message: err.message
                    }
                );
            };
            console.log(data);
        }
    );
    let petDataset = JSON.parse(rawPetDataset);

    const userLanguage = req.params.language;

    if(userLanguage === "tr"){
        const trResponse = [];
        for(var pet in petDataset.pets){
            var petGeneralId = pet.id;
            var petName = pet.name.tr;

            var petSpecies = [];
            for(var species in pet.species){
                var speciesId = species.id;
                var speciesName = species.tr;

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