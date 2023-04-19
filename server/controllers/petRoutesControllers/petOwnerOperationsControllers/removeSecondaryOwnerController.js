import Pet from "../../../models/Pet.js";
import User from "../../../models/User.js";

const removeSecondaryOwnerController = async (req, res) => {
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

export default removeSecondaryOwnerController;