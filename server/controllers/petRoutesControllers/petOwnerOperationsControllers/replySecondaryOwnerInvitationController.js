import Pet from "../../../models/Pet.js";
import User from "../../../models/User.js";
import SecondaryOwnerInvitation from "../../../models/ownerOperations/SecondaryOwnerInvitation.js";

const replySecondaryOwnerInvitationController = async (req, res) => {
    try{
        //check type of users response
        const isResponseBoolean = req.params.usersResponse === 'false' 
                                  || req.params.usersResponse === 'true';
        if( !isResponseBoolean ){
          return res.status( 400 )
                    .json(
                        {
                          error: true,
                          message: "You can only response invitation with boolean"
                        }
                    );
        }
  
        //validate if there is a invitation id
        if(
          !req.params
              .invitationId
        ){
          return res.status( 400 )
                    .json(
                        {
                          error: true,
                          message: "Invitation id is required"
                        }
                    );
        }
  
        //if user rejected invitation
        const usersResponse = req.params
                                 .usersResponse;

        if( usersResponse === 'false' ){
          try{
            await SecondaryOwnerInvitation.findOneAndDelete(
              {
                _id: req.params.invitationId,
                to: req.user._id.toString()
              }
            );
  
            return res.status( 200 )
                          .json(
                            {
                              error: false,
                              message: "Invitation rejected successfully"
                            }
                          );
          }catch( err ){
            console.log( err );
            return res.status( 500 )
                      .json(
                        {
                          error: true,
                          message: "Internal Server Error"
                        }
                      );
          }
        };
  
        //if user accepts invitation
        const invitation = await SecondaryOwnerInvitation.findOne(
          {
            _id: req.params.invitationId,
            to: req.user._id
          }
        );
        
        if( !invitation ){
          return res.status( 404 )
                    .json(
                      {
                        error: true,
                        message: "Invitation couldn't found"
                      }
                    );
          }

          const owner = await User.findById( invitation.from );
          const secondaryOwner = await User.findById( invitation.to );
          const pet = await Pet.findById( invitation.petId );
  
          if(
            !owner 
            || owner.deactivation
                    .isDeactive
            || owner.blockedUsers
                    .includes( 
                          invitation.to 
                     )
            || !secondaryOwner 
            || secondaryOwner.deactivation
                             .isDeactive
            || secondaryOwner.blockedUsers
                             .includes( 
                                    invitation.from 
                              )
            || !pet
          ){
            return res.status( 404 )
                      .json(
                        {
                          error: true,
                          message: "User or Pet not found"
                        }
                      );
          }

          if( 
            pet.allOwners
               .includes( secondaryOwner._id ) 
          ){
            return res.status( 400 )
                      .json(
                        {
                          error: true,
                          message: "User is allready owner"
                        }
                      )
          }
          
          if(
            pet.primaryOwner
               .toString() !== owner._id
                                    .toString() 
            &&  pet.primaryOwner
                   .toString() === secondaryOwner._id
                                                 .toString()
          ){
            return res.status( 401 )
                      .json(
                        {
                          error: true,
                          message: "You can't edit this pet"
                        }
                      );
          }
      
          //check if the user which is gonna be secondary user does exists
          if( !secondaryOwner ){
            return res.status( 404 )
                      .json(
                        {
                          error: true,
                          message: "User not found"
                        }
                      );
          }
          //insert secondary owner to pet
          pet.allOwners = pet.allOwners
                             .filter(
                                owner => 
                                    owner !== secondaryOwner._id
                                                            .toString()
                             );

          pet.allOwners
             .push(
                secondaryOwner._id
                              .toString()
              );

          pet.markModified( "allOwners" );
          pet.save(
                ( err ) => {
                  if( err ) {
                    console.error( 'ERROR: While Update! ');
                  }
                }
              );
  
          //check dependency status of primary owner
          const isPrimaryUserAllreadyDepended = false;
          const isPetAllreadyInsertedToPrimaryOwner = false;

          for(
            var i = 0; 
            i > owner.dependedUsers.length; 
            i ++
          ){

            if( owner.dependedUsers[ i ] === secondaryOwner._id ){
              isPrimaryUserAllreadyDepended = true;
            };

            for(
              var index = 0; 
              index < secondaryOwner.dependedUsers[ i ]
                                    .linkedPets
                                    .length;
              index ++
            ){
              if(
                owner.dependedUsers[ i ]
                     .linkedPets[ index ] === pet._id
              ){
                isPetAllreadyInsertedToPrimaryOwner = true;
              }
            }
          };
  
          //add dependancy to primary owner
          if(
            !isPrimaryUserAllreadyDepended 
            && !isPetAllreadyInsertedToPrimaryOwner
          ){
            owner.dependedUsers
                 .push(
                    {
                      user: secondaryOwner._id
                                          .toString(),
                      linkedPets: [
                                    pet._id
                                       .toString() 
                                  ]
                    }
                  );
          }else if(
            isPrimaryUserAllreadyDepended 
            && !isPetAllreadyInsertedToPrimaryOwner
          ){
            owner.dependedUsers
                 .filter(
                    dependeds => 
                        dependeds === secondaryOwner._id
                  ).linkedPets
                   .push( 
                      pet._id
                         .toString 
                    );
          }else if( 
            isPetAllreadyInsertedToPrimaryOwner 
          ){
            return res.status( 500 )
                      .json(
                        {
                          error: true,
                          message: `user with the id: ${ 
                                                          owner._id
                                                               .toString()
                                                      }, is allready depended with user with the id: ${
                                                                                                        secondaryOwner._id
                                                                                                                      .toString()
                                                                                                      } by the pet with the id: ${
                                                                                                                                  pet._id
                                                                                                                                     .toString()
                                                                                                                                }`
                        }
                      );
          };
  
          owner.markModified( "dependedUsers" );
          owner.save(
            ( err ) => {
              if( err ){
                console.error( 'ERROR: While Update Primary Owner!' );
              }
            }
          );
  
          //check dependency status of secondary owner
          const isSecondaryUserAllreadyDepended = false;
          const isPetAllreadyInsertedToSecondaryOwner = false;
          for(
            var i = 0; 
            i < secondaryOwner.dependedUsers
                              .length; 
            i ++
          ){
            if( 
                secondaryOwner.dependedUsers[ i ] === owner._id 
            ){
                isSecondaryUserAllreadyDepended = true;
            };

            for(
              var index = 0; 
              index < secondaryOwner.dependedUsers[ i ]
                                    .linkedPets
                                    .length; 
              index ++
            ){
                      
              if(
                secondaryOwner.dependedUsers[ i ]
                              .linkedPets[ index ] === pet._id
              ){
                isPetAllreadyInsertedToSecondaryOwner = true;
              }
            }
          }
  
          //add dependancy to secondary user
          if(
            !isSecondaryUserAllreadyDepended 
            && !isPetAllreadyInsertedToSecondaryOwner
          ){
            secondaryOwner.dependedUsers
                          .push(
                              {
                                user: owner._id
                                           .toString(),
                                linkedPets: [ 
                                              pet._id
                                                 .toString() 
                                            ]
                              }
                          );
           }else if(
              isSecondaryUserAllreadyDepended 
              && !isPetAllreadyInsertedToSecondaryOwner
           ){
              secondaryOwner.dependedUsers
                            .filter(
                              dependeds => 
                                  dependeds.toString() === owner._id
                                                                .toString()
                            ).linkedPets
                             .push( 
                                    pet._id
                                       .toString() 
                                  );
            }else if(
              isPetAllreadyInsertedToSecondaryOwner
            ){
              return res.status( 500 )
                        .json(
                            {
                              error: true,
                              message: `user with the id: ${
                                                            secondaryOwner._id
                                                          }, is allready depended with user with the id: ${
                                                                                                          owner._id
                                                                                                        } by the pet with the id: ${
                                                                                                                                    pet._id
                                                                                                                                  }`
                            }
                          );
             };
  
             secondaryOwner.markModified( "dependedUsers" );
             secondaryOwner.save(
               ( err ) => {
                 if( err ){
                   console.error( 'ERROR: While Update Secondary Owner!' );
                 }
               }
             );

             //delete invititation
             SecondaryOwnerInvitation.deleteOne(
               {
                 _id: invitation._id,
                 to: req.user._id
               },
               ( err ) => {
                 if( err ){
                   console.log( err );
                 }
               }
             );

             //send response
             return res.status( 200 )
                       .json(
                         {
                           error: false,
                           message: `@${
                                         secondaryOwner.userName
                                      } recorded as owner succesfully`,
                         }
                       );
    }catch( err ){
        console.log( err );
        res.status( 500 )
           .json(
                {
                    error: true,
                    message: "Internal Server Error"
                }
            );
        }
}

export default replySecondaryOwnerInvitationController;