import express from "express";
import { animalCategoryReqValidation } from "../../utils/bodyValidation/animalCategoryReqValidationSchema.js";
import auth from "../../middleware/auth.js";
import { createRequire } from "module";
import User from "../../models/User.js";

const require = createRequire(import.meta.url);
const rawPetDataset = require('../../src/pet_dataset.json');
const petDataset = JSON.parse(JSON.stringify(rawPetDataset));

const router = express.Router();

//Get Pet Keywords
router.get(
    "/:language",
    auth,
    async (req, res) => {

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
        for(var i = 0; i < petDataset.pets.length; i ++){
            var petGeneralId = petDataset.pets[i].id;
            var petName = petDataset.pets[i].name.en;

            var petSpecies = [];
            for(var index = 0; index < petDataset.pets[i].species.length; index ++){
                var speciesId = petDataset.pets[i].species[index].id;
                var speciesName = petDataset.pets[i].species[index].en;

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

//Insert Keyword
router.post(
    "/insertInterestedPets",
    auth,
    async (req, res) => {
        try{
            const { error } = animalCategoryReqValidation(req.body);
            if(error){
                return res.status(400).json(
                    {
                      error: true,
                      message: error.details[0].message
                    }
                  );
            }else{
                User.findById(
                    req.user._id,
                    (error, updateUser) => {
                        if(error){
                            return res.status(404).json(
                                {
                                    error: true,
                                    message: "User can not found"
                                }
                            );
                        }else{
                            const requestArray = req.body.selectedPetCategories;
                            const isArrayEmpty = requestArray.length === 0;
                            if( !isArrayEmpty ){
                                for(var i = 0; i < requestArray.length; i ++){
                                    const petTag = {
                                        petId: requestArray[i].petId,
                                        speciesId: requestArray[i].speciesId
                                    };
                                    const isTagAllreadyExist = updateUser.interestingPetTags.find(
                                        tag => 
                                            tag.petId === petTag.petId
                                            && tag.speciesId === petTag.speciesId
                                    );
                                    if(isTagAllreadyExist){
                                        updateUser.interestingPetTags = updateUser.interestingPetTags.filter(
                                            tag => 
                                                tag.petId !== petTag.petId
                                                && tag.speciesId !== petTag.speciesId 
                                        );
                                    }else{
                                        updateUser.interestingPetTags.push(petTag);
                                    }
                                };
                                updateUser.markModified('interestingPetTags');
                                updateUser.save(
                                    function (err) {
                                        if(err) {
                                            console.error('ERROR: While Update!');
                                            return res.status(500).json(
                                                {
                                                    error: true,
                                                    message: "Internal server error"
                                                }
                                            );
                                        }
                                    }
                                ).then(
                                    (data) => {
                                        return res.status(200).json({
                                            error: false,
                                            message: "Tag process succesful"
                                        });
                                    }
                                )
                            }
                        }
                    }
                );
            }
        }catch(err){
            res.status(500).json(
                {
                    error: true,
                    message: err.message
                }
            );
        }
    }
)

  export default router;