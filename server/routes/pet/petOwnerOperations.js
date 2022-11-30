import express from "express";
import Pet from "../../models/Pet.js";
import auth from "../../middleware/auth.js";
import User from "../../models/User.js";

const router = express.Router();

//Add secondary owner to pet
router.put(
    "/addSecondaryOwner/:petId/:secondaryOwnerId",
    auth,
    async (req, res) => {
      try{
        //find pet
        const pet = await Pet.findOne(
          {
            _id: req.params.petId,
            primaryOwner: req.user._id
          }
        );
        //check if pet exists
        if(pet){
          if(!pet.allOwners.includes(req.params.secondaryOwnerId)){
            //find user which is gonna be secondary user
            const secondaryOwner = await User.findById(
              req.params.secondaryOwnerId
            );
      
            //check if the user which is gonna be secondary user does exists
            if(secondaryOwner){
              //insert secondary owner to pet
              pet.allOwners.push(secondaryOwner._id);
              pet.markModified("allOwners");
              pet.save(
                function (err) {
                  if(err) {
                      console.error('ERROR: While Update!');
                  }
                }
              );
              
              //find primary owner
              const primaryOwner = await User.findById(
                req.user._id
              );

              //check dependency status of secondary owner
              const isPrimaryUserAllreadyDepended = false;
              const isPetAllreadyInsertedToPrimaryOwner = false;
              for(var i = 0; i > primaryOwner.dependedUsers.length; i ++){
                if( primaryOwner.dependedUsers[i] === secondaryOwner._id ){
                  isPrimaryUserAllreadyDepended = true;
                };
                for(var index = 0; index < secondaryOwner.dependedUsers[i].linkedPets.length; i ++){
                  if(primaryOwner.dependedUsers[i].linkedPets[index] === req.params.petId){
                    isPetAllreadyInsertedToPrimaryOwner = true;
                  }
                }
              };

              //add dependancy to primary owner
              if(!isPrimaryUserAllreadyDepended && !isPetAllreadyInsertedToPrimaryOwner){
                primaryOwner.dependedUsers.push(
                  {
                    user: secondaryOwner._id,
                    linkedPets: [ pet._id ]
                  }
                );
              }else if(isPrimaryUserAllreadyDepended && !isPetAllreadyInsertedToPrimaryOwner){
                primaryOwner.dependedUsers.filter(
                  dependeds => dependeds === secondaryOwner._id
                ).linkedPets.push( pet._id );
              }else if(isPetAllreadyInsertedToPrimaryOwner){
                return res.status(500).json(
                  {
                    error: true,
                    message: `user with the id: ${primaryOwner._id}, is allready depended with user with the id: ${secondaryOwner._id} by the pet with the id: ${pet._id}`
                  }
                );
              };

              primaryOwner.markModified("dependedUsers");
              primaryOwner.save(
                function (err) {
                  if(err) {
                      console.error('ERROR: While Update Primary Owner!');
                  }
                }
              );
  
              //check dependency status of secondary owner
              const isSecondaryUserAllreadyDepended = false;
              const isPetAllreadyInsertedToSecondaryOwner = false;
              for(var i = 0; i < secondaryOwner.dependedUsers.length; i ++){
                if( secondaryOwner.dependedUsers[i] === req.user._id ){
                  isSecondaryUserAllreadyDepended = true;
                };
                for(var index = 0; index < secondaryOwner.dependedUsers[i].linkedPets.length; i ++){
                  if(secondaryOwner.dependedUsers[i].linkedPets[index] === req.params.petId){
                    isPetAllreadyInsertedToSecondaryOwner = true;
                  }
                }
              }
  
              //add dependancy to secondary user
              if(!isSecondaryUserAllreadyDepended && !isPetAllreadyInsertedToSecondaryOwner){
                secondaryOwner.dependedUsers.push(
                  {
                    user: req.user._id,
                    linkedPets: [ pet._id ]
                  }
                );
              }else if(isSecondaryUserAllreadyDepended && !isPetAllreadyInsertedToSecondaryOwner){
                secondaryOwner.dependedUsers.filter(
                  dependeds => dependeds === req.user._id
                ).linkedPets.push( pet._id );
              }else if(isPetAllreadyInsertedToSecondaryOwner){
                return res.status(500).json(
                  {
                    error: true,
                    message: `user with the id: ${secondaryOwner._id}, is allready depended with user with the id: ${req.user._id} by the pet with the id: ${pet._id}`
                  }
                );
              };
  
              secondaryOwner.markModified("dependedUsers");
              secondaryOwner.save(
                function (err) {
                  if(err) {
                      console.error('ERROR: While Update Secondary Owner!');
                  }
                }
              );
  
              //send response
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
                message: "This user is allready recorded as owner"
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
  );
  
  //Remove secondary owner of the pet
  router.put(
    "/removeSecondaryOwner/:petId/:secondaryOwnerId",
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
          if(pet.allOwners.includes(req.params.secondaryOwnerId)){
            const secondaryOwner = await User.findById(
              req.params.secondaryOwnerId
            );
      
            if(secondaryOwner){
              pet.allOwners = pet.allOwners.filter( owner => owner !== secondaryOwner._id );
              pet.markModified("allOwners");
              pet.save(
                function (err) {
                  if(err) {
                      console.error('ERROR: While Update!');
                  }
                }
              );

              //find primary owner
              const primaryOwner = await User.findById(
                req.user._id
              );

              //check dependency status of primary owner
              const isPrimaryUserAllreadyDepended = false;
              const isPetAllreadyInsertedToPrimaryOwner = false;
              for(var i = 0; i < primary.dependedUsers.length; i ++){
                if( primary.dependedUsers[i] === secondaryOwner._id ){
                  isPrimaryUserAllreadyDepended = true;
                }
                for(var index = 0; index < primaryOwner.dependedUsers[i].linkedPets.length; i ++){
                  if(primaryOwner.dependedUsers[i].linkedPets[index] === req.params.petId){
                    isPetAllreadyInsertedToPrimaryOwner = true;
                  }
                }
              }

              //remove dependency of the primary owner
              if(isPrimaryUserAllreadyDepended && isPetAllreadyInsertedToPrimaryOwner){
                const primaryOwnerDepended = primaryOwner.dependedUsers.filter(depended => depended.user === secondaryOwner._id).linkedPets;
                if(primaryOwnerDepended.length > 1){
                  primaryOwner.dependedUsers.linkedPets = primaryOwner.dependedUsers.filter(
                    depended => depended.user === secondaryOwner._id
                  ).linkedPets.filter(
                    linkedPet => linkedPet !== pet._id
                  );
                }else{
                  primaryOwner.dependedUsers = primaryOwner.dependedUsers.filter(
                    depended => depended.user !== secondaryOwner._id
                  );
                }
              }else if(!isPetAllreadyInsertedToSecondaryOwner){
                return res.status(500).json(
                  {
                    error: true,
                    message: `user with the id: ${primaryOwner._id}, was not depended with user with the id: ${secondaryOwner._id} by the pet with the id: ${pet._id}`
                  }
                );
              };

              primaryOwner.markModified("dependedUsers");
              primaryOwner.save(
                function (err) {
                  if(err) {
                      console.error('ERROR: While Update Primary Owner!');
                  }
                }
              );
  
              //check dependency status of secondary user
              const isSecondaryUserAllreadyDepended = false;
              const isPetAllreadyInsertedToSecondaryOwner = false;
              for(var i = 0; i < secondaryOwner.dependedUsers.length; i ++){
                if( secondaryOwner.dependedUsers[i] === req.user._id ){
                  isSecondaryUserAllreadyDepended = true;
                }
                for(var index = 0; index < secondaryOwner.dependedUsers[i].linkedPets.length; i ++){
                  if(secondaryOwner.dependedUsers[i].linkedPets[index] === req.params.petId){
                    isPetAllreadyInsertedToSecondaryOwner = true;
                  }
                }
              }
  
              //remove dependency of the secondary user
              if(isSecondaryUserAllreadyDepended && isPetAllreadyInsertedToSecondaryOwner){
                const secondaryOwnerDepended = secondaryOwner.dependedUsers.filter(depended => depended.user === req.user._id).linkedPets;
                if(secondaryOwnerDepended.length > 1){
                  secondaryOwner.dependedUsers.linkedPets = secondaryOwner.dependedUsers.filter(
                    depended => depended.user === req.user._id
                  ).linkedPets.filter(
                    linkedPet => linkedPet !== pet._id
                  );
                }else{
                  secondaryOwner.dependedUsers = secondaryOwner.dependedUsers.filter(
                    depended => depended.user !== req.user._id
                  );
                }
              }else if(!isPetAllreadyInsertedToSecondaryOwner){
                return res.status(500).json(
                  {
                    error: true,
                    message: `user with the id: ${secondaryOwner._id}, was not depended with user with the id: ${req.user._id} by the pet with the id: ${pet._id}`
                  }
                );
              };
  
              secondaryOwner.markModified("dependedUsers");
              secondaryOwner.save(
                function (err) {
                  if(err) {
                      console.error('ERROR: While Update Secondary Owner!');
                  }
                }
              );
  
              //send response
              return res.status(200).json(
                {
                  error: false,
                  message: `@${secondaryOwner.userName} is not owner of @${pet.name} anymore.`,
    
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
                message: "This user is allready recorded as owner"
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
  );

export default router;