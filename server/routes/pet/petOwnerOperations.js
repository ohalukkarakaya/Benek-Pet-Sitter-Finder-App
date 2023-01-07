import express from "express";
import Pet from "../../models/Pet.js";
import auth from "../../middleware/auth.js";
import User from "../../models/User.js";
import { handOverInvitationReqParamsValidation } from "../../utils/bodyValidation/pets/handOverInvitationValidationSchema.js";
import PetHandOverInvitation from "../../models/ownerOperations/PetHandOverInvitation.js";
import { secondaryOwnerInvitationReqParamsValidation } from "../../utils/bodyValidation/pets/secondaryOwnerInvitationValidationSchema.js";
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
              if(!secondaryOwner || secondaryOwner.deactivation.isDeactive){
                return res.status(404).json(
                  {
                    error: true,
                    message: "User which you are trying to record as secondary owner is not found"
                  }
                );
              }
      
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
      //check type of users response
      const isResponseBoolean = req.params.usersResponse === 'false' || req.params.usersResponse === 'true';
      if(!isResponseBoolean){
        console.log(req.params.usersResponse);
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
      if(usersResponse == 'false'){
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

        if(!owner || owner.deactivation.isDeactive || !secondaryOwner || secondaryOwner.deactivation.isDeactive){
          return res.status(404).json(
            {
              error: true,
              message: "User not found"
            }
          );
        }

        //check if pet exists
        if(pet){
          if(!pet.allOwners.includes(secondaryOwner._id)){
            if(pet.primaryOwner.toString() === owner._id.toString() &&  pet.primaryOwner.toString() !== secondaryOwner._id.toString()){
    
              //check if the user which is gonna be secondary user does exists
              if(secondaryOwner){
                //insert secondary owner to pet
                if(
                  pet.allOwners.filter(
                    owner => 
                      owner !== secondaryOwner._id.toString()
                  )
                ){
                  pet.allOwners.push(secondaryOwner._id.toString());
                  pet.markModified("allOwners");
                  pet.save(
                    function (err) {
                      if(err) {
                        console.error('ERROR: While Update!');
                      }
                    }
                  );
                }

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
                      user: secondaryOwner._id.toString(),
                      linkedPets: [ pet._id.toString() ]
                    }
                  );
                }else if(isPrimaryUserAllreadyDepended && !isPetAllreadyInsertedToPrimaryOwner){
                  owner.dependedUsers.filter(
                    dependeds => dependeds === secondaryOwner._id
                  ).linkedPets.push( pet._id.toString );
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
                      user: owner._id.toString(),
                      linkedPets: [ pet._id.toString() ]
                    }
                  );
                }else if(isSecondaryUserAllreadyDepended && !isPetAllreadyInsertedToSecondaryOwner){
                  secondaryOwner.dependedUsers.filter(
                    dependeds => dependeds.toString() === owner._id.toString()
                  ).linkedPets.push( pet._id.toString() );
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

                //delete invititation
                SecondaryOwnerInvitation.deleteOne(
                  {
                    _id: invitation._id,
                    to: req.user._id
                  },
                  (err) => {
                    if(err){
                      console.log(err);
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
          
      }else{
        return res.status(404).json(
          {
            error: true,
            message: "Invitation couldn't found"
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
        }
      );
      let primaryOwnerId;
      if(pet){
        const isAuthorized = req.user._id === pet.primaryOwner || pet.allOwners.includes(req.user._id) && req.user._id === req.params.secondaryOwnerId;
        //check if user who sended request is authorized
        if(!isAuthorized){
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
        
          if(!secondaryOwner || secondaryOwner.deactivation.isDeactive){
            return res.status(404).json(
              {
                error: true,
                message: "User not found"
              }
            );
          }

          pet.allOwners = pet.allOwners.filter( owner => owner.toString() !== secondaryOwner._id.toString() );
          pet.markModified("allOwners");
          pet.save(
            function (err) {
              if(err) {
                console.error('ERROR: While Update!');
              }
            }
          );
  
          if(req.user._id.toString() === pet.primaryOwner.toString() || req.user._id.toString() === secondaryOwner._id.toString() ){
            //find primary owner
            const primaryOwner = await User.findById(
              pet.primaryOwner
            );
            if(!primaryOwner || primaryOwner.deactivation.isDeactive){
              return res.status(404).json(
                {
                  error: true,
                  message: "User not found"
                }
              );
            }
            primaryOwnerId = primaryOwner._id.toString();
  
            //check dependency status of primary owner
            var isPrimaryUserAllreadyDepended = false;
            var isPetAllreadyInsertedToPrimaryOwner = false;
            for(var i = 0; i < primaryOwner.dependedUsers.length; i ++){
              if( primaryOwner.dependedUsers[i].user.toString() === secondaryOwner._id.toString() ){
                isPrimaryUserAllreadyDepended = true;
              }
              for(var index = 0; index < primaryOwner.dependedUsers[i].linkedPets.length; index ++){
                if(primaryOwner.dependedUsers[i].linkedPets[index].toString() === req.params.petId.toString()){
                  isPetAllreadyInsertedToPrimaryOwner = true;
                }
              }
            }
  
            //remove dependency of the primary owner
            if(isPrimaryUserAllreadyDepended && isPetAllreadyInsertedToPrimaryOwner){
              const primaryOwnerDepended = primaryOwner.dependedUsers.filter(depended => depended.user.toString() === secondaryOwner._id.toString());
              if(primaryOwnerDepended[0].linkedPets.length > 1){
                primaryOwner.dependedUsers.linkedPets = primaryOwner.dependedUsers.filter(
                  depended => depended.user === secondaryOwner._id
                ).linkedPets.filter(
                  linkedPet => linkedPet !== pet._id
                );
              }else{
                primaryOwner.dependedUsers = primaryOwner.dependedUsers.filter(
                  depended => depended.user.toString() !== secondaryOwner._id.toString()
                );
              }
            }else if(!isPetAllreadyInsertedToPrimaryOwner){
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
          var isSecondaryUserAllreadyDepended = false;
          var isPetAllreadyInsertedToSecondaryOwner = false;
          for(var i = 0; i < secondaryOwner.dependedUsers.length; i ++){
            if( secondaryOwner.dependedUsers[i].user.toString() === req.user._id.toString() || secondaryOwner._id.toString() === req.user._id.toString() ){
              isSecondaryUserAllreadyDepended = true;
            }
            for(var index = 0; index < secondaryOwner.dependedUsers[i].linkedPets.length; index ++){
              if(secondaryOwner.dependedUsers[i].linkedPets[index].toString() === req.params.petId.toString() || secondaryOwner._id.toString() === req.user._id.toString()){
                isPetAllreadyInsertedToSecondaryOwner = true;
              }
            }
          }
    
          //remove dependency of the secondary user
          if(isSecondaryUserAllreadyDepended && isPetAllreadyInsertedToSecondaryOwner){
            const secondaryOwnerDepended = secondaryOwner.dependedUsers.filter(depended => depended.user.toString() === primaryOwnerId);
            if(secondaryOwnerDepended[0].linkedPets.length > 1){
              secondaryOwner.dependedUsers[0].linkedPets = secondaryOwner.dependedUsers.filter(
                depended => depended.user === primaryOwnerId
              ).linkedPets.filter(
                linkedPet => linkedPet !== pet._id
              );
            }else{
              secondaryOwner.dependedUsers = secondaryOwner.dependedUsers.filter(
                depended => depended.user.toString() !== primaryOwnerId
              );
            }
          }else if(!isPetAllreadyInsertedToSecondaryOwner && secondaryOwner._id.toString() !== req.user._id){
            return res.status(500).json(
              {
                error: true,
                message: `user with the id: ${secondaryOwner._id}, was not depended with user with the id: ${req.user._id} by the pet with the id: ${pet._id}`
              }
            );
          };
    
          if(secondaryOwner._id.toString() === req.user._id.toString() || primaryOwnerId === req.user._id.toString()){
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

      const invitedUserId = req.params.invitedUserId;
      const invitedUser = await User.findById(invitedUserId);
      const petId = req.params.petId;
      const userId = req.user._id;

      if(!invitedUser || invitedUser.deactivation.isDeactive){
        return res.status(404).json(
          {
            error: true,
            message: "user not found"
          }
        );
      }

      if(invitedUser && userId !== invitedUserId){
        const pet = await Pet.findById(petId);
        if(pet && pet.primaryOwner === userId){
          await new PetHandOverInvitation(
            {
              from: userId,
              to: invitedUserId,
              petId: petId
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
      const invitationId = req.params.invitationId;
      const userResponse = req.params.usersResponse;
    
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
      const isUsersResponseBoolean = userResponse === 'true' || userResponse === 'false';
      if(!isUsersResponseBoolean){
        return res.status(400).json(
          {
            error: true,
            message: "response must be boolean"
          }
        );
      };

      const usersResponse = userResponse === 'true' || userResponse !== 'false';

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

      //find pet
      const petId = invitation.petId.toString();
      const pet = await Pet.findOne({_id: petId});

      //find owner
      const ownerId = invitation.from.toString();
      const owner = await User.findOne({_id: ownerId});

      //find invited user
      const invitedUserId = invitation.to.toString();
      const invitedUser = await User.findOne({_id: invitedUserId});

      //validate users and pet
      if(!pet || !owner || owner.deactivation.isDeactive || !invitedUser || invitedUser.deactivation.isDeactive || req.user._id.toString() !== invitedUser._id.toString() || pet.primaryOwner.toString() !== owner._id.toString()){
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
            dependedUser.dependedUsers[index] = dependedUser.dependedUsers[index].linkedPets.filter(
              linkedPet => linkedPet.toString() !== pet._id.toString()
            );
          }else{
            dependedUser.dependedUsers = dependedUser.dependedUsers.filter(
              linkedUser => linkedUser.user.toString() !== owner._id.toString()
            );
          }
        }

        if(dependedUser._id.toString() !== owner._id.toString()){
          dependedUser.markModified('dependedUsers');
          dependedUser.save();
        }
      }

      //delete dependency of owner
      for( var i = 0; i < owner.dependedUsers.length; i ++ ){
        const petCount = owner.dependedUsers[i].linkedPets.length;
        for( var index = 0; index < petCount; index ++){
          if(owner.dependedUsers[i].linkedPets.length > 1){ 
            if(owner.dependedUsers[i].linkedPets[index] === pet._id.toString()){
              owner.dependedUsers[i] = owner.dependedUsers[i].linkedPets.filter(
                lnkdpt => lnkdpt.toString() !== pet._id.toString()
              );
            }
          }else{
            if(owner.dependedUsers[i].linkedPets[index] === pet._id.toString()){
              owner.dependedUsers = owner.dependedUsers.filter(
                dpndUsr => dpndUsr.user.toString() !== owner.dependedUsers[i].user.toString()
              );
            }
          }
        }
        owner.markModified('dependedUsers');
      }

      //insert pet to new user as owned pet
      invitedUser.pets.push(pet._id.toString());
      invitedUser.markModified('pets');

      //clean pets all secondary owners
      pet.allOwners = [ invitedUser._id.toString() ];
      pet.handOverRecord.push(
        {
          from: owner._id.toString(),
          to: invitedUser._id.toString(),
        }
      );
      pet.markModified('allOwners');
      pet.markModified('handOverRecord');

      //hand over pet
      pet.primaryOwner = invitedUser._id.toString();
      pet.markModified('primaryOwner');

      //delete owners dependency
      owner.pets = owner.pets.filter(p => p.toString() !== pet._id.toString());
      owner.markModified('pets');
      delete owner.__v;

      //save all
      owner.save();
      invitedUser.save();
      pet.save();

      //set invitation to notification
      PetHandOverInvitation.deleteOne(
        {
          _id: invitation._id,
          to: invitedUser._id
        },
        (err) => {
          if(err){
            console.log(err);
          }
        }
      );

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

export default router;