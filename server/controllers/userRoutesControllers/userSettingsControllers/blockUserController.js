import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";
import Notification from "../../../models/Notification.js";
import Chat from "../../../models/Chat/Chat.js";
import InviteEvent from "../../../models/Event/Invitations/InviteEvent.js";
import SecondaryOwnerInvitation from "../../../models/ownerOperations/SecondaryOwnerInvitation.js";
import PetHandOverInvitation from "../../../models/ownerOperations/PetHandOverInvitation.js";

const blockUserController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const blockingUserId = req.params
                                  .userId
                                  .toString();
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

        for(
            let blockingUsersPetsId
            of blockingUser.pets
        ){
            let blockingUsersPet = await Pet.findById( blockingUsersPetsId.toString() );
            if( usersPet ){
                blockingUsersPet.followers = blockingUsersPet.followers
                                             .filter(
                                                petsFollower =>
                                                    petsFollower !== userId
                                             );

                blockingUsersPet.allOwners = blockingUsersPet.allOwners
                                                             .filter(
                                                                blockingUsersPetsSecondaryOwner =>
                                                                    blockingUsersPetsSecondaryOwner !== userId
                                                             );

                blockingUsersPet.markModified( "allOwners" );
                blockingUsersPet.markModified( "followers" );
                blockingUsersPet.save(
                    function (err) {
                        if(err) {
                            console.error('ERROR: While Update!');
                        }
                    }
                );
            }

            user.followingUsersOrPets = user.followingUsersOrPets
                                            .filter(
                                                usersFollowings =>
                                                    usersFollowings.followingId !== blockingUsersPetsId
                                            )
        }

        user.dependedUsers = user.dependedUsers
                                 .filter(
                                    usersDependedUsers =>
                                        usersDependedUsers != blockingUserId
                                 );

        user.followers = user.followers
                             .filter(
                                follower =>
                                    follower !== blockingUserId
                             );
        
        user.followingUsersOrPets = user.followingUsersOrPets
                                        .filter(
                                            following =>
                                                following.followingId != blockingUserId
                                        );

        user.markModified( "dependedUsers" );
        user.markModified( "followers" );
        user.markModified( "followingUsersOrPets" );

        for(
            let usersPetsId
            of user.pets
        ){
            let usersPet = await Pet.findById( usersPetsId.toString() );
            if( usersPet ){
                usersPet.followers = usersPet.followers
                                             .filter(
                                                petsFollower =>
                                                    petsFollower !== blockingUserId
                                             );

                usersPet.allOwners = usersPet.allOwners
                                             .filter(
                                                usersPetsSecondaryOwner =>
                                                    usersPetsSecondaryOwner !== userId
                                             );
                                             
                usersPet.markModified( "allOwners" );
                usersPet.markModified( "followers" );
                usersPet.save(
                    function (err) {
                        if(err) {
                            console.error('ERROR: While Update!');
                        }
                    }
                );
            }

            blockingUser.followingUsersOrPets = blockingUser.followingUsersOrPets
                                                            .filter(
                                                                blockingUsersFollowing =>
                                                                    blockingUsersFollowing.followingId !== usersPetsId
                                                            )
        }

        blockingUser.dependedUsers = blockingUser.dependedUsers
                                                 .filter(
                                                    blockingUsersDependedUsers =>
                                                        blockingUsersDependedUsers != userId
                                                 );

        blockingUser.followingUsersOrPets = blockingUser.followingUsersOrPets
                                                        .filter(
                                                            blockingUsersFollowing =>
                                                                blockingUsersFollowing.followingId !== userId
                                                        )

        blockingUser.followers = blockingUser.followers
                                             .filter(
                                                blockingUsersFollower =>
                                                    blockingUsersFollower.toString() !== userId
                                             );

        blockingUser.markModified( "dependedUsers" );
        blockingUser.markModified( "followingUsersOrPets" );
        blockingUser.markModified( "followers" );
        blockingUser.save(
            function (err) {
                if(err) {
                    console.error('ERROR: While Update!');
                }
            }
        );

        //delete notifications
        const sendedNotifications = await Notification.find(
                                                            {
                                                                from: userId,
                                                                to: { $in: [ blockingUserId ] }
                                                            }
                                                       );

        for(
            let notification
            of sendedNotifications
        ){ 
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

        const receivedNotifications = await Notification.find(
                                                            {
                                                                from: blockingUserId,
                                                                to: { $in: [ userId ] }
                                                            }
                                                         );
        for(
            let notification
            of receivedNotifications
        ){
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

        // get out of chat groups
        const releatedChats = await Chat.find(
                                            {
                                                $and: [
                                                    { "members.userId": { $in: [ userId ] } },
                                                    { "members.userId": { $in: [ blockingUserId ] } },
                                                ]
                                            }
                                        );

        for(
            let chat
            of releatedChats
        ){
                chat.members = chat.members
                                   .filter(
                                        chatMember =>
                                            chatMember.userId
                                                      .toString() !== userId
                                    );
        }

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
        user.markModified( "blockedUsers" );
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