import User from "../../../models/User.js";
import Notification from "../../../models/Notification.js";
import Chat from "../../../models/Chat/Chat.js";
import InviteEvent from "../../../models/Event/Invitations/InviteEvent.js";
import SecondaryOwnerInvitation from "../../../models/ownerOperations/SecondaryOwnerInvitation.js";
import PetHandOverInvitation from "../../../models/ownerOperations/PetHandOverInvitation.js";

const blockUserController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const blockingUserId = req.params.userId.tostring();
        if( !blockingUserId ){
            return res.status( 400 )
                      .json(
                          {
                              error: true,
                              message: "missing params"
                          }
                      );
        }

        const user = await User.findById( userId );
        const blockingUser = await User.findById( blockingUserId );
        if(
            !blockingUser 
            || blockingUser.isDeactive 
            || blockingUser.blockedUsers
                           .includes( userId )
        ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "user not found"
                            }
                       );
        }

        if(
            user.dependedUsers.includes( blockingUserId )
            || blockingUser.dependedUsers.includes( userId )
        ){
            return res.status( 406 )
                      .json(
                        {
                            error: true,
                            message: "You have dependency with user"
                        }
                      );
        }

        if( 
            user.blockedUsers
                .includes( blockingUserId ) 
        ){
            return res.status( 400 )
                      .json(
                          {
                              error: true,
                              message: "User already blocked"
                          }
                      );
        }

        //delete notifications
        const sendedNotifications = await Notification.find(
                                                            {
                                                                from: userId,
                                                                to: { $in: { blockingUserId } }
                                                            }
                                                       );

        sendedNotifications.forEach(
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
                                                    userId =>
                                                        userId.toString() !== blockingUserId
                                                  );

                    notification.seenBy = notification.seenBy
                                                      .filter(
                                                          userId =>
                                                             userId.toString() !== blockingUserId
                                                       );

                    notification.openedBy = notification.openedBy
                                                        .filter(
                                                          userId =>
                                                             userId.toString() !== blockingUserId
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

        const receivedNotifications = await Notification.find(
                                                            {
                                                                from: blockingUserId,
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
                                                $and: [
                                                    { "members.userId": { $in: { userId } } },
                                                    { "members.userId": { $in: { blockingUser } } },
                                                ]
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

        user.blockedUsers.push( blockingUserId );
        user.markModified.apply( "blockedUsers" );
        user.save(
            function (err) {
                if(err) {
                    console.error('ERROR: While Update!');
                }
            }
        );

        return res.status( 200 )
                  .json(
                      {
                          error: false,
                          message: "User blocked succesfully"
                      }
                  );

    }catch( err ){
        console.log("Error: block user", err);
        return res.status( 500 )
                  .json(
                        {
                            error: true,
                            message: "Internal server error"
                        }
                   );
    }
}

export default blockUserController;