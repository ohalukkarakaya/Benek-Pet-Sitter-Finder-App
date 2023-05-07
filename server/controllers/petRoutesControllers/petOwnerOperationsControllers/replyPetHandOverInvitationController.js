import Pet from "../../../models/Pet.js";
import User from "../../../models/User.js";
import PetHandOverInvitation from "../../../models/ownerOperations/PetHandOverInvitation.js";

const replyPetHandOverInvitationController = async (req, res) => {
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
        if(
          !pet 
          || !owner 
          || owner.deactivation.isDeactive 
          || owner.blockedUsers.includes( invitedUserId )
          || !invitedUser 
          || invitedUser.deactivation.isDeactive
          || invitedUser.blockedUsers.includes( invitedUserId )
          || req.user._id.toString() !== invitedUser._id.toString() 
          || pet.primaryOwner.toString() !== owner._id.toString()
        ){
          return res.status( 404 ).json(
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

export default replyPetHandOverInvitationController;