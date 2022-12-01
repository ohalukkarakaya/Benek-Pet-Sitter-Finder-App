import express from "express";
import Pet from "../../models/Pet.js";
import auth from "../../middleware/auth.js";
import User from "../../models/User.js";
import { handOverInvitationReqBodyValidation, handOverInvitationReqParamsValidation } from "../../utils/handOverInvitationValidationSchema.js";
import PetHandOverInvitation from "../../models/ownerOperations/PetHandOverInvitation.js";
import { secondaryOwnerInvitationReqParamsValidation } from "../../utils/secondaryOwnerInvitationValidationSchema.js";
import SecondaryOwnerInvitation from "../../models/ownerOperations/SecondaryOwnerInvitation.js";

const router = express.Router();

//send secondary owner invite
router.post(
    "/inviteSecondaryOwner/:petId/:secondaryOwnerId",
    auth,
    async (req, res) => {
      try{
        const { error } = secondaryOwnerInvitationReqParamsValidation(req.params);
        if(error){
          return res.status(400).json(
            {
              error: true,
              message: error.details[0].message
            }
          );
        };
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
            if(pet.primaryOwner === req.user._id &&  pet.primaryOwner !== req.params.secondaryOwnerId){
              //find user which is gonna be secondary user
              const secondaryOwner = await User.findById(
                req.params.secondaryOwnerId
              );
      
              //check if the user which is gonna be secondary user does exists
              if(secondaryOwner){
                //Create Invitation
                await new SecondaryOwnerInvitation(
                  {
                    from: req.user._id,
                    to: secondaryOwner.id,
                    petId: req.params.petId
                  }
                ).save().then(
                  (invitation) => {
                    return res.status(200).json(
                      {
                        error: false,
                        invitation: invitation
                      }
                    );
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
              return res.status(401).json(
                {
                  error: true,
                  message: "You can edit just your pet"
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

//accept or reject secondary owner invitation
router.put(
  "/secondaryOwnerInvitation/:invitationId/:usersResponse",
  auth,
  async (req, res) => {
    try{
      //check type od users response
      if(typeof req.params.usersResponse !== 'boolean'){
        return res.status(400).json(
          {
            error: true,
            message: "You can only response invitation with boolean"
          }
        );
      }

      //validate if there is a invitation id
      if(!req.params.invitationId){
        return res.status(400).json(
          {
            error: true,
            message: "Invitation id is required"
          }
        );
      }

      //if user rejected invitation
      const usersResponse = req.params.usersResponse;
      if(!usersResponse){
        return await SecondaryOwnerInvitation.findOneAndDelete(
          {
            _id: req.params.invitationId,
            to: req.user._id
          }
        ).then(
          (_) => {
            return res.status(200).json(
              {
                error: false,
                message: "Invitation rejected successfully"
              }
            );
          }
        );
      };

      //if user accepts invitation
      const invitation = await SecondaryOwnerInvitation.findOne(
        {
          _id: req.params.invitationId,
          to: req.user._id
        }
      );
      if(invitation){
        const owner = await User.findById(invitation.from);
        const secondaryOwner = await User.findById(invitation.to);
        const pet = await Pet.findById(invitation.petId);

        //check if pet exists
        if(pet){
          if(!pet.allOwners.includes(secondaryOwner._id)){
            if(pet.primaryOwner === owner._id &&  pet.primaryOwner !== secondaryOwner._id){
    
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

                //check dependency status of primary owner
                const isPrimaryUserAllreadyDepended = false;
                const isPetAllreadyInsertedToPrimaryOwner = false;
                for(var i = 0; i > owner.dependedUsers.length; i ++){
                  if( owner.dependedUsers[i] === secondaryOwner._id ){
                    isPrimaryUserAllreadyDepended = true;
                  };
                  for(var index = 0; index < secondaryOwner.dependedUsers[i].linkedPets.length; i ++){
                    if(owner.dependedUsers[i].linkedPets[index] === pet._id){
                      isPetAllreadyInsertedToPrimaryOwner = true;
                    }
                  }
                };

                //add dependancy to primary owner
                if(!isPrimaryUserAllreadyDepended && !isPetAllreadyInsertedToPrimaryOwner){
                  owner.dependedUsers.push(
                    {
                      user: secondaryOwner._id,
                      linkedPets: [ pet._id ]
                    }
                  );
                }else if(isPrimaryUserAllreadyDepended && !isPetAllreadyInsertedToPrimaryOwner){
                  owner.dependedUsers.filter(
                    dependeds => dependeds === secondaryOwner._id
                  ).linkedPets.push( pet._id );
                }else if(isPetAllreadyInsertedToPrimaryOwner){
                  return res.status(500).json(
                    {
                      error: true,
                      message: `user with the id: ${owner._id}, is allready depended with user with the id: ${secondaryOwner._id} by the pet with the id: ${pet._id}`
                    }
                  );
                };

                owner.markModified("dependedUsers");
                owner.save(
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
                  if( secondaryOwner.dependedUsers[i] === owner._id ){
                    isSecondaryUserAllreadyDepended = true;
                  };
                  for(var index = 0; index < secondaryOwner.dependedUsers[i].linkedPets.length; i ++){
                    if(secondaryOwner.dependedUsers[i].linkedPets[index] === pet._id){
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
                      message: `user with the id: ${secondaryOwner._id}, is allready depended with user with the id: ${owner._id} by the pet with the id: ${pet._id}`
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

                //set invitation to notification
                invitation.situation.isAccepted = true;
                invitation.situation.time = Date.now();
                invitation.markModified('situation');
                invitation.save();

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
              return res.status(401).json(
                {
                  error: true,
                  message: "You can edit just your pet"
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
        //check if user who sended request is authorized
        if(req.user._id !== pet.primaryOwner || req.user._id !== secondaryOwner){
          return res.status(403).json(
            {
              error: false,
              message: "You are unauthorized to remove this user"
            }
          );
        }
        //check if secondary owner is realy secondary owner
        if(pet.allOwners.includes(req.params.secondaryOwnerId)){
          //find secondary owner
          const secondaryOwner = await User.findById(
            req.params.secondaryOwnerId
          );
        
          //if secondary owner is exist
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
  
            if(req.user._id === pet.primaryOwner){
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
            }
    
            //check dependency status of secondary user
            const isSecondaryUserAllreadyDepended = false;
            const isPetAllreadyInsertedToSecondaryOwner = false;
            for(var i = 0; i < secondaryOwner.dependedUsers.length; i ++){
              if( secondaryOwner.dependedUsers[i] === req.user._id || secondaryOwner._id === req.user._id ){
                isSecondaryUserAllreadyDepended = true;
              }
              for(var index = 0; index < secondaryOwner.dependedUsers[i].linkedPets.length; i ++){
                if(secondaryOwner.dependedUsers[i].linkedPets[index] === req.params.petId || secondaryOwner._id === req.user._id){
                  isPetAllreadyInsertedToSecondaryOwner = true;
                }
              }
            }
    
            //remove dependency of the secondary user
            if(isSecondaryUserAllreadyDepended && isPetAllreadyInsertedToSecondaryOwner && secondaryOwner._id !== req.user._id){
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
            }else if(!isPetAllreadyInsertedToSecondaryOwner && secondaryOwner._id !== req.user._id){
              return res.status(500).json(
                {
                  error: true,
                  message: `user with the id: ${secondaryOwner._id}, was not depended with user with the id: ${req.user._id} by the pet with the id: ${pet._id}`
                }
              );
            };
    
            if(secondaryOwner._id !== req.user._id){
              secondaryOwner.markModified("dependedUsers");
              secondaryOwner.save(
                function (err) {
                  if(err) {
                    console.error('ERROR: While Update Secondary Owner!');
                  }
                }
              );
            };
    
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
              message: "This user is not recorded as owner"
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
      };
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

//Pet Hand Over Invitation
router.post(
"/petHandOverInvitation/:petId/:invitedUserId",
auth,
async (req, res) => {
  try{
    //check sended data
    const { paramsValidationError } = handOverInvitationReqParamsValidation(req.params);
      if(paramsValidationError){
        return res.status(400).json(
          {
            error: true,
            message: paramsValidationError.details[0].message
          }
        );
      }
      const { bodyValidationError } = handOverInvitationReqBodyValidation(req.body);
      if(bodyValidationError){
        return res.status(400).json(
          {
            error: true,
            message: bodyValidationError.details[0].message
          }
        );
      }

      const invitedUserId = req.params.invitedUserId;
      const invitedUser = await User.findById(invitedUserId)
      const petId = req.params.petId;
      const userId = req.user._id;

      if(invitedUser && userId !== invitedUserId){
        const pet = await Pet.findById(petId);
        if(pet && pet.primaryOwner === userId){
          await new PetHandOverInvitation(
            {
              from: userId,
              to: invitedUserId,
              petId: petId,
              priceUnit: req.body.priceUnit,
              price: req.body.price
            }
          ).save().then(
            (invitation) => {
              return res.status(200).json(
                {
                  error: false,
                  invitation: invitation
                }
              );
            }
          );
        }else{
          return res.status(400).json(
            {
              error: true,
              message: "Pet couldn't found or it doesn't belong to you"
            }
          );
        }
      }else{
        return res.status(400).json(
          {
            error: true,
            message: "ivited user couldn't found or it is you"
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

//Accept Or Reject Pet Hand Over Invitation
router.put(
  "/petHandOverInvitation/:invitationId/:usersResponse",
  auth,
  async (req, res) => {
    try{
      //To DO: yasak olduğu için ücret karşılığı hayvan devri iptal!!!
      const invitationId = req.params.invitationId;
      const usersResponse = req.params.usersResponse;
    
      //check if there is a sended value for invitation id 
      if(!invitationId){
        return res.status(400).json(
          {
            error: true,
            message: "invitation id is required"
          }
        );
      };

      //check if users responses type is boolean
      if(typeof usersResponse !== "boolean"){
        return res.status(400).json(
          {
            error: true,
            message: "response must be boolean"
          }
        );
      };

      //if user rejected the invitation
      if(!usersResponse){
        return await PetHandOverInvitation.findOneAndDelete(
          {
            _id: invitationId,
            to: req.user._id
          }
        ).then(
          (_) => {
            return res.status(200).json(
              {
                error: false,
                message: "invitation rejected succesfully"
              }
            );
          }
        );
      };

      //find invitation
      const invitation = await PetHandOverInvitation.findOne(
        {
          _id: invitationId,
          to: req.user._id
        }
      );

      //if invitation couldn't found
      if(!invitation){
        return res.status(404).json(
          {
            error: true,
            message: "couldn't find the invitation"
          }
        );
      };

      let price;
      if(invitation.price !== 0){
        price = `${invitation.price}${invitation.priceUnit}`;
      };

      //find pet
      const pet = await Pet.findById(invitation.pet);

      //find owner
      const owner = await User.findById(invitation.from);

      //find invited user
      const invitedUser = await User.finfById(invitation.to);

      //validate users and pet
      if(!pet || !owner || !invitedUser || req.user._id !== invitedUser._id || pet.primaryOwner !== owner._id){
        return res.status(404).json(
          {
            error: true,
            message: "Pet, user or invited user couldn't found or there is an issue with authorization"
          }
        )
      };

      //delete dependency of all secondary owners of the pet
      for( var i = 0; i < pet.allOwners.length; i++ ){
        const dependedUser = await User.findById(pet.allOwners[i]);
        for( var index = 0; index < dependedUser.dependedUsers.length; index ++ ){
          if( dependedUser.dependedUsers[index].linkedPets.length > 1 ){
            dependedUser.dependedUsers[index].linkedPets.filter(
              linkedPet => linkedPet !== pet._id
            );
          }else{
            dependedUser.dependedUsers[index].filter(
              linkedUser => linkedUser.user !== owner._id
            );
          }
        }
        dependedUser.markModified('dependedUsers');
        if(dependedUser._id !== owner._id || dependedUser !== invitedUser._id){
          dependedUser.save();
        }
      }

      //delete owners dependency
      owner.pets.filter(pets => pets !== pet._id);
      owner.markModified('pets');

      //insert pet to new user as owned pet
      invitedUser.pets.push(pet.$assertPopulated._id);
      invitedUser.markModified('pets');

      //clean pets all secondary owners
      pet.allOwners = [];
      pet.handOverRecord.push(
        {
          from: owner._id,
          to: invitedUser._id,
          price: price
        }
      );
      pet.markModified('allOwners');
      pet.markModified('handOverRecord');

      //hand over pet
      pet.primaryOwner = invitedUser._id;
      pet.markModified('primaryOwner');

      //save all
      await owner.save();
      await invitedUser.save();
      await pet.save();

      //set invitation to notification
      invitation.situation.isAccepted = true;
      invitation.situation.time = Date.now();
      invitation.markModified('situation');
      invitation.save();

      //send success response
      return res.status(200).json(
        {
          error: false,
          message: `Pet ${pet.name} hand over succesfully to @${invitedUser.userName}`
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

router.delete(
  "/deleteInvitation/:invitationId:/:invitationType",
  auth,
  async (req, res) => {
    try{
       if(req.params.invitationType == "SecondaryOwner"){
         await SecondaryOwnerInvitation.findOneAndDelete(
          {
            _id: req.params.invitationId,
            from: req.user._id
          }
         ).then(
          (_) => {
            return res.status(200).json(
              {
                error: false,
                message: "Invitation deleted succesfully"
              }
            );
          }
         );
       }else if(req.params.invitationType == "HandOver"){
        await PetHandOverInvitation.findOneAndDelete(
          {
            _id: req.params.invitationId,
            from: req.user._id
          }
         ).then(
          (_) => {
            return res.status(200).json(
              {
                error: false,
                message: "Invitation deleted succesfully"
              }
            );
          }
         );
       }else{
        return res.status(400).json(
          {
            error: true,
            message: 'invitation type just can be "SecondaryOwner" or "HandOver"'
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