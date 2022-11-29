import express from "express";
import Pet from "../../models/Pet.js";
import { createPetReqBodyValidation } from "../../utils/createPetValidationSchema.js";
import auth from "../../middleware/auth.js";
import { createRequire } from "module";
import User from "../../models/User.js";

const require = createRequire(import.meta.url);
const rawPetDataset = require('../../src/pet_dataset.json');
const petDataset = JSON.parse(JSON.stringify(rawPetDataset));

const router = express.Router();

//Create Pet
router.post(
    "/createPet", 
    auth,
    async (req, res) => {
      try{
        const { error } = createPetReqBodyValidation(req.body);
        if(error)
          return res.status(400).json(
            {
              error: true,
              message: error.details[0].message
            }
          );
        
        let petKind;
        let petSpecies;

        for(var i = 0; i < petDataset.pets.length; i ++){
          if(petDataset.pets[i].id === req.body.kindCode){
            petKind = petDataset.pets[i].name;
            for(var index = 0; index < petDataset.pets[i].species.length; index ++){
              if(petDataset.pets[i].species[index].id === req.body.speciesCode){
                petSpecies = {
                    "tr": petDataset.pets[i].species[index].tr,
                    "en": petDataset.pets[i].species[index].en
                  };
                console.log(petSpecies);
              }
            }
          }
        }
  
        const pet = await Pet.find(
          {
            $or: [
              {
                name: req.body.name,
                kind: req.body.kindCode,
                species: req.body.speciesCode,
                primaryOwner: req.user._id
              },
              {
                name: req.body.name,
                kind: req.body.kindCode,
                species: req.body.speciesCode,
                allOwners: { $in: [ req.user._id ]}
              }
            ]
          }
        );
        if(pet.length > 0){
          return res.status(400).json(
            {
              error: true,
              message: "Pet Allready Exists",
              petId: pet._id,
              petName: pet.name 
            }
          );
        }
  
        await new Pet(
          {
            name: req.body.name,
            bio: req.body.petBio,
            sex: req.body.sex,
            birthDay: req.body.birthDay,
            kind: req.body.kindCode,
            species: req.body.speciesCode,
            primaryOwner: req.user._id,
            allOwners: [ req.user._id ],
          }
        ).save().then(
          (result) => {
            User.findByIdAndUpdate(
              req.user._id,
              {
                $push: {
                  pets: result._id
                }
              }
            ).then(
              (_) => {
                const currentYear = new Date().getFullYear();
                const petsBirthYear = result.birthDay.getFullYear();

                return res.status(200).json(
                  {
                    error: false,
                    message: "Pet created succesfully",
                    data: {
                      petId: result._id,
                      petName: pet.name,
                      petAge: `${currentYear - petsBirthYear} years old`,
                      petKind: petKind,
                      petSpecies: petSpecies
                    }
                  }
                );
              }
            );
          }
        );  
      }catch(err){
          console.log(err);
          res.status(500).json(
              {
                  error: true,
                  message: "Internal Server Error"
              }
          );
      }
    }
  );

//Add secondary owner to pet
router.put(
  "/addSecondaryOwner/:petId/:secondaryOwnerId",
  auth,
  async (req, res) => {
    try{
      const pet = await Pet.findOne(
        {
          _id: req.params.petId,
          primaryOwner: req.user._id
        }
      );
      if(pet){
        if(!pet.allOwners.includes(req.params.secondaryOwnerId)){
          const secondaryOwner = await User.findById(
            req.params.secondaryOwnerId
          );
    
          if(secondaryOwner){
            pet.allOwners.push(secondaryOwner._id)
            pet.markModified("allOwners");
            pet.save(
              function (err) {
                if(err) {
                    console.error('ERROR: While Update!');
                }
              }
            );
            return res.status(200).json(
              {
                error: false,
                message: `@${secondaryOwner.userName} recorded as owner succesfully`,
  
              }
            );
          }else{
            return res.status(404).json(
              {
                error: true,
                message: "User which you are trying to record as secondary owner is not found"
              }
            );
          }
        }else{
          return res.status(400).json(
            {
              error: false,
              message: "This user is allready recorded asowner"
            }
          );
        }
      }else{
        return res.status(404).json(
          {
            error: true,
            message: "Pet not found"
          }
        );
      }
    }catch(err){
      console.log(err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
  }
)

export default router;
