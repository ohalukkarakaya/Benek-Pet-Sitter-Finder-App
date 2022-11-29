import express from "express";
import Pet from "../../models/Pet.js";
import { signUpBodyValidation } from "../../utils/signUpValidationSchema.js";
import auth from "../../middleware/auth.js";

const router = express.Router();
//Insert Pet
router.post(
    "/createPet", 
    auth,
    async (req, res) => {
      try{
        const { error } = signUpBodyValidation(req.body);
        if(error)
          return res.status(400).json(
            {
              error: true,
              message: error.details[0].message
            }
          );
  
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
        if(pet){
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
            password: hashPassword,
            primaryOwner: req.user._id,
            allOwners: [ req.user._id ],
          }
        ).save().then(
          (result) => {
            user.pets.push(result._id);
            user.markModified('pets');
            user.save(
              function (err) {
                if(err) {
                  console.error('ERROR: While Update!');
                  res.status(500).json(
                    {
                      error: true,
                      message: "Internal server error"
                    }
                  );
                }
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

export default router;
