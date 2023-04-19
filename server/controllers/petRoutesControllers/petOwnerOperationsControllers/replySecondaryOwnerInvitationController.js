import Pet from "../../../models/Pet.js";
import User from "../../../models/User.js";
import SecondaryOwnerInvitation from "../../../models/ownerOperations/SecondaryOwnerInvitation.js";

const replySecondaryOwnerInvitationController = async (req, res) => {
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
        if(usersResponse === 'false'){
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

export default replySecondaryOwnerInvitationController;