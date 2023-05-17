import User from "../../../models/User.js";
import CareGive from "../../../models/CareGive/CareGive.js";
import UserToken from "../../../models/UserToken.js";
import Notification from "../../../models/Notification.js";
import InviteEvent from "../../../models/Event/Invitations/InviteEvent.js";
import SecondaryOwnerInvitation from "../../../models/ownerOperations/SecondaryOwnerInvitation.js";
import PetHandOverInvitation from "../../../models/ownerOperations/PetHandOverInvitation.js";

import dotenv from "dotenv";


dotenv.config();

const deleteUserController = async (req, res) => {
    try{
        const userId = req.user._id.toString();
  
        const user = await User.findById(userId);
        if(!user || user.deactivation.isDeactive){
          return res.status(404).json(
            {
              error: true,
              message: "user not found"
            }
          );
        }
  
        const areThereAnyLinkedCareGive = await CareGive.findOne(
          {
            $or: [
              {
                "careGiver.careGiverId": user._id.toString()
              },
              {
                "petOwner.petOwnerId": user._id.toString()
              }
            ]
          }
        );
  
        if(areThereAnyLinkedCareGive){
          return res.status(400).json(
            {
              error: true,
              messaage: "You have a care give linked to you"
            }
          );
        }

        //delete notifications
        await Notification.deleteMany(
                                {
                                  from: userId
                                }
                           );

        const receivedNotifications = await Notification.find(
                                                            {
                                                                to: { $in: { userId } }
                                                            }
                                                       );

        receivedNotifications.forEach(
            ( notification ) => {
                if( 
                    notification.to
                                .length >= 1
                ){
                    notification.deleteOne()
                                .then()
                                .catch(
                                    async ( error ) => {
                                        if( error ){
                                            console.log( error );
                                        }
                                    }
                                );
                }else{
                    notification.to = notification.to
                                                  .filter(
                                                    notificationUserId =>
                                                        notificationUserId.toString() !== userId
                                                  );

                    notification.seenBy = notification.seenBy
                                                      .filter(
                                                        notificationUserId =>
                                                             notificationUserId.toString() !== userId
                                                       );

                    notification.openedBy = notification.openedBy
                                                        .filter(
                                                          notificationUserId =>
                                                             notificationUserId.toString() !== userId
                                                       );

                    notification.markModified( "to" );
                    notification.markModified( "seenBy" );
                    notification.markModified( "openedBy" );
                    notification.save(
                        ( err ) => {
                            if( err ) {
                                console.error('ERROR: While Update!');
                            }
                          }
                    );
                }
            }
        );

        // get out of chat groups
        const releatedChats = await Chat.find(
                                            {
                                              "members.userId": { 
                                                                  $in: { 
                                                                        userId 
                                                                       } 
                                                                } 
                                            }
                                        );

        releatedChats.forEach(
            ( chat ) => {
                chat.members = chat.members
                                   .filter(
                                        chatMember =>
                                            chatMember.userId
                                                      .toString() !== userId
                                    );
            }
        );

        //delete invitations
        //delete event invitations
        await InviteEvent.deleteMany(
            {
              $or: [
                  {
                      $and: [
                          { eventAdmin: userId },
                          { invitedId: blockingUserId }
                      ]
                  },
                  {
                      $and: [
                          { eventAdmin: blockingUserId },
                          { invitedId: userId }
                      ]
                  }
              ]
            }
         );

        //delete secondaryOwner invitations
        await SecondaryOwnerInvitation.deleteMany(
            {
              $or: [
                  {
                      $and: [
                          { from: userId },
                          { to: blockingUserId }
                      ]
                  },
                  {
                      $and: [
                          { from: blockingUserId },
                          { to: userId }
                      ]
                  }
              ]
            }
        );

        //delete petHandOver invitations
        await PetHandOverInvitation.deleteMany(
            {
              $or: [
                  {
                      $and: [
                          { from: userId },
                          { to: blockingUserId }
                      ]
                  },
                  {
                      $and: [
                          { from: blockingUserId },
                          { to: userId }
                      ]
                  }
              ]
            }
        );
  
        const userToken = await UserToken.findOne(
          {
              token: req.body.refreshToken,
          }
        );
  
        if(userToken){
          await userToken.remove();
        }
  
        if(user.deactive.isDeactive){
          return res.status(400).json(
            {
              error: true,
              message: "user is already deactive"
            }
          );
        }
  
        user.deactivation.isDeactive = true;
        user.deactivation.deactivationDate = Date.now();
        user.deactivation.isAboutToDelete = true;
        user.markModified("deactivation");
        user.save().then(
          (_) => {
            return res.status(200).json(
              {
                error: false,
                message: "User deactivated and will be deleted after 30 days"
              }
            );
          }
        ).catch(
          (err) => {
            if(err){
              console.log(err);
              return res.status(500).json(
                {
                  error: true,
                  message: "Internal server error"
                }
              );
            }
          }
        );
  
    }catch(err){
        console.log("Error: delete user", err);
        return res.status(500).json(
          {
            error: true,
            message: "Internal server error"
          }
        );
    }
}

export default deleteUserController;