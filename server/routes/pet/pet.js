import express from "express";
import Pet from "../../models/Pet.js";
import { createPetReqBodyValidation } from "../../utils/bodyValidation/createPetValidationSchema.js";
import auth from "../../middleware/auth.js";
import { createRequire } from "module";
import User from "../../models/User.js";
import { updatePetProfileImg } from "../../middleware/imageHandle/serverHandlePetProfileImage.js";
import { uploadPetImages } from "../../middleware/imageHandle/serverHandlePetImages.js";
import { uploadPetVaccinationCertificate } from "../../middleware/imageHandle/serverHandlePetVaccinationCertificates.js";
import s3 from "../../utils/s3Service.js";
import dotenv from "dotenv";

const require = createRequire(import.meta.url);
const rawPetDataset = require('../../src/pet_dataset.json');
const petDataset = JSON.parse(JSON.stringify(rawPetDataset));

dotenv.config();
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

//Edit Profile Image and Cover Image of the Pet
router.put(
  "/petProfileImage/:petId", 
  auth,
  updatePetProfileImg,
  async (req, res, next) => {
    try{
      let petProfileImageSucces;
      let petCoverImageSucces;
      let successResponse;

      //if there is existing images and they uploaded to media server
      if (req.files) {

        if(req.files.petProfileImg){
          var uploadedProfileImgImage = req.files.petProfileImg[0].location;
          console.log(`Profile Image: ${uploadedProfileImgImage}`);
        }
        if(req.files.petCoverImg){
          var uploadedCoverImgImage = req.files.petCoverImg[0].location;
          console.log(`Cover Image: ${uploadedCoverImgImage}`);
        }

        if(
          req.files.petProfileImg
          && req.files.petCoverImg
        ) {
          //if there is profile image and cover image both
          petProfileImageSucces = uploadedProfileImgImage;
          petCoverImageSucces = uploadedCoverImgImage;
        }else if(
          req.files.petProfileImg
          && !req.files.petCoverImg
        ) {
          //if there is only profile image
          petProfileImageSucces = uploadedProfileImgImage;
        }else if(
          !req.files.petProfileImg
          && req.files.petCoverImg
        ) {
          //if there is only cover image
          petCoverImageSucces = uploadedCoverImgImage;
        }
        next();
      }

      //check what did updated
      if(
        petProfileImageSucces !== null
        || petCoverImageSucces !== null
      ){
        successResponse = {
          error: false,
          profileImageUrl: petProfileImageSucces,
          coverImageUrl: petCoverImageSucces
        };
        next();
      }

      if(successResponse !== null){
        await req.pet.save(
          function (err) {
            if(err) {
                console.error('ERROR: While Update!');
            }
          }
        );
        return res.status(200).json(
          successResponse
        );
      }else{
        return res.status(400).json(
          {
            error: true,
            message: "Empty Request Body"
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
);

//Insert Images of the pet
router.put(
  "/petsImages/:petId", 
  auth,
  uploadPetImages,
  async (req, res) => {
    try{
      var urlList = [];
      for(var i = 0; i < req.files.length; i ++){
        urlList.push(req.files[i].location);
        req.pet.images.push(req.files[i].location);
      }
      if(urlList.length !== 0){
        req.pet.markModified('images');
        req.pet.save(
          function (err) {
            if(err) {
                console.error('ERROR: While Update!');
            }
          }
        );
        return req.res.status(200).json(
          {
            error: false,
            data: urlList
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
);

//Delete Images of the pet
router.delete(
  "/petsImages/:petId", 
  auth,
  async (req, res) => {
    try{
      const urlList = req.body.urlList;
      if(!urlList || !(urlList.length > 0)){
        return res.status(400).json(
          {
            error: true,
            message: "Image url to delet is required"
          }
        );
      }

      await Pet.findById(req.params.petId).then(
        (pet) => {
          if(!pet){
            return res.status(404).json(
              {
                error: true,
                message: "Pet couldn't found"
              }
            );
          }

          const promiseUrlDelete = urlList.map(
            (url) => {
              return new Promise(
                (resolve, reject) => {
                  const splitUrl = url.split('/');
                  const imgName = splitUrl[splitUrl.length - 1];
  
                  const deleteImageParams = {
                    Bucket: process.env.BUCKET_NAME,
                    Key: `pets/${pet._id.toString()}/petsImages/${imgName}`
                  };
                  s3.deleteObject(
                    deleteImageParams,
                    (error, data) => {
                      if(error){
                        console.log("error", error);
                        return res.status(500).json(
                          {
                            error: true,
                            message: "An error occured while deleting images"
                          }
                        );
                      }

                      pet.images = pet.images.filter(
                        imgUrl => 
                          imgUrl !== url
                      );
                      return resolve(true);
                    }
                  );
                }
              );
            }
          );

          Promise.all(promiseUrlDelete).then(
            (_) => {
              const petImages = pet.images;
              pet.markModified("images");
              pet.save(
                (err) => {
                  if(err){
                    console.log("error", err);
                    return res.status(500).json(
                      {
                        error: true,
                        message: "An error occured while saving to database"
                      }
                    );
                  }
                }
              );
              return res.status(200).json(
                {
                  error: false,
                  message: "images deleted succesfully",
                  remainedPetImages: petImages
                }
              );
            }
          );
        }
      )
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

//Insert Vaccination Certificate of the Pet
router.put(
  "/petsVaccinationCertificate/:petId", 
  auth,
  uploadPetVaccinationCertificate,
  async (req, res) => {
    try{
      if(req.file.location){
        req.pet.vaccinations.push(
          {
            desc: req.body.desc,
            fileUrl: req.file.location
          }
        );
        req.pet.markModified('vaccinations');
        req.pet.save(
          function (err) {
            if(err) {
                console.error('ERROR: While Update!');
            }
          }
        );
        return req.res.status(200).json(
          {
            error: false,
            url: req.file.location,
            desc: req.body.desc
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
);

export default router;
