import Pet from "../../../models/Pet.js";
import User from "../../../models/User.js";
import SecondaryOwnerInvitation from "../../../models/ownerOperations/SecondaryOwnerInvitation.js";

import { secondaryOwnerInvitationReqParamsValidation } from "../../../utils/bodyValidation/pets/secondaryOwnerInvitationValidationSchema.js";
import sendNotification from "../../../utils/notification/sendNotification.js";

const inviteSecondaryOwnerController = async (req, res) => {
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
              if(
                !secondaryOwner 
                || secondaryOwner.deactivation.isDeactive
                || secondaryOwner.blockedUsers.includes( req.user._id.toString() )
              ){
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
                async ( invitation ) => {
                  await sendNotification(
                      invitation.from.toString(),
                      invitation.to.toString(),
                      "secondaryPetOwnerInvitation",
                      invitation._id.toString(),
                      null,
                      null,
                      null,
                      null,
                      null,
                      null
                  );
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

export default inviteSecondaryOwnerController;