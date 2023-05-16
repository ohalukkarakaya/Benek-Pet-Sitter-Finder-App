import Pet from "../../../models/Pet.js";
import User from "../../../models/User.js";
import PetHandOverInvitation from "../../../models/ownerOperations/PetHandOverInvitation.js";

import { handOverInvitationReqParamsValidation } from "../../../utils/bodyValidation/pets/handOverInvitationValidationSchema.js";
import sendNotification from "../../../utils/notification/sendNotification.js";

const petHandOverInvitationController = async (req, res) => {
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
          const invitedUser = await User.findById( invitedUserId );
          const petId = req.params.petId;
          const userId = req.user._id;
    
          if(
            !invitedUser 
            || invitedUser.deactivation.isDeactive
            || invitedUser.blockedUsers.includes( req.user._id.toString() )
          ){
            return res.status(404).json(
              {
                error: true,
                message: "user not found"
              }
            );
          }
    
          if(
            invitedUser 
            && userId !== invitedUserId
          ){
            const pet = await Pet.findById( petId );
            if(
              pet 
              && pet.primaryOwner === userId
            ){
              await new PetHandOverInvitation(
                {
                  from: userId,
                  to: invitedUserId,
                  petId: petId
                }
              ).save().then(
                async ( invitation ) => {
                  await sendNotification(
                      invitation.from.toString(),
                      invitation.to.toString(),
                      "petHandOverInvitation",
                      invitation._id.toString(),
                      null,
                      null,
                      null,
                      null,
                      null,
                      null
                  );
                  return res.status( 200 ).json(
                    {
                      error: false,
                      invitation: invitation
                    }
                  );
                }
              );
            }else{
              return res.status( 400 ).json(
                {
                  error: true,
                  message: "Pet couldn't found or it doesn't belong to you"
                }
              );
            }
          }else{
            return res.status( 400 ).json(
              {
                error: true,
                message: "ivited user couldn't found or it is you"
              }
            );
          }
        }catch(err){
          console.log(err);
          res.status( 500 ).json(
            {
              error: true,
              message: "Internal Server Error"
            }
          );
        }
}

export default petHandOverInvitationController;