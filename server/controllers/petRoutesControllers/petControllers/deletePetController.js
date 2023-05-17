import User from "../../../models/User.js";
import CareGive from "../../../models/CareGive/CareGive.js";
import ReportMission from "../../../models/Report/ReportMission.js";

import s3 from "../../../utils/s3Service.js";

import dotenv from "dotenv";

dotenv.config();

const deletePetController = async (req, res) => {
    try{
        //clean depandancies
          const primaryOwner = await User.findById(
                                                req.pet
                                                   .primaryOwner
                                                   .toString()
                                          );
          const allOwners = req.pet
                               .allOwners
                               .filter(
                                    owner => 
                                        owner.toString() !== req.pet
                                                                .primaryOwner
                                                                .toString()
                                );
          const petId = req.pet
                           ._id
                           .toString();
                           
          const petFollowers = req.pet
                                  .followers;
    
          //check if pet is on care give
          await CareGive.findOne(
            { petId: petId },
            ( err, careGive ) => {
              if( 
                careGive 
                && !careGive.finishProcess
                            .isFinished 
              ){
                return res.status( 400 )
                          .json(
                             {
                               error: true,
                               message: "Pet is on care give"
                             }
                           );
              }
            }
          ).clone();
    
          await ReportMission.findOne(
            { petId: petId },
            ( err, report ) => {
              if( report ){
                return res.status( 400 )
                          .json(
                            {
                              error: true,
                              message: "There is reported mission about this pet"
                            }
                          );
              }
            }
          ).clone();
    
          //clean followers follow event
          for( var i = 0; i < petFollowers.length; i ++ ){
            follower = await User.findById( petFollowers[i] );
            follower.followingUsersOrPets = follower.followingUsersOrPets
                                                    .filter(
                                                       followingObject =>
                                                           followingObject.followingId
                                                                          .toString() !== petId
                                                     );
            follower.markModified( "followingUsersOrPets" );
            follower.save(
              ( err ) => {
                if( err ){
                    console.error( 'ERROR: While deleting follow event of follower' );
                    return res.status( 500 )
                              .json(
                                   {
                                      error: true,
                                      message: 'ERROR: While deleting follow event of follower'
                                   }
                               );
                }
              }
            );
          }
    
          //clean dependecy of primary owner
          primaryOwner.pets = primaryOwner.pets
                                          .filter(
                                              pet => pet.toString() !== req.pet
                                                                           ._id
                                                                           .toString()
                                           );
          
          for( 
            var i = 0; 
            i < allOwners.length; 
            i ++ 
          ){
            for(
              var indx = 0; 
              indx < primaryOwner.dependedUsers
                                 .length; 
              indx ++
            ){
              const dep = primaryOwner.dependedUsers[indx];
              const secondaryOwner = allOwners[i];
    
              if(
                dep.user
                   .toString() === secondaryOwner.toString()
              ){
                if(
                  dep.linkedPets
                     .length > 1
                ){
                  primaryOwner.dependedUsers[indx]
                              .linkedPets = primaryOwner.dependedUsers[indx]
                                                        .linkedPets
                                                        .filter(
                                                              pets => pets.toString() !== req.pet
                                                                                             ._id
                                                                                             .toString()
                                                         );
                }else{
                  primaryOwner.dependedUsers = primaryOwner.dependedUsers
                                                           .filter(
                                                              depUser => depUser.user
                                                                                .toString() !== secondaryOwner.toString()
                                                            );
                }
              }
            }
          }
    
          primaryOwner.markModified( "pets" );
          primaryOwner.markModified( "dependedUsers" );
          primaryOwner.save(
            function (err) {
              if(err) {
                console.error( 
                          `ERROR: While Updating Owner "${
                                                        primaryOwner._id
                                                                    .toString()
                                                       }"!` 
                        );
              }
            }
          );
    
          //clean dependency of secondary owners
          for(
            var i = 0; 
            i < allOwners.length; 
            i ++
          ){
            const ownerId = allOwners[i].toString();
            const owner = await User.findById( ownerId );
            const deps = owner.dependedUsers;
    
            for(
              var indx = 0; 
              indx < deps.length; 
              indx ++
            ){
              if(
                deps[indx].user
                          .toString() === req.pet
                                             .primaryOwner
                                             .toString()
              ){
                const linkedPets = deps[indx].linkedPets;
                if( linkedPets.length > 1 ){
                  owner.dependedUsers[indx]
                       .linkedPets = owner.dependedUsers[indx]
                                          .linkedPets
                                          .filter(
                                            pets => 
                                                pets.toString() !== req.pet
                                                                       ._id
                                                                       .toString()
                                          );
                }else{
                  owner.dependedUsers = owner.dependedUsers
                                             .filter(
                                                dependeds => 
                                                    dependeds !== deps[indx]
                                              );
                }
              }
            }
    
            owner.markModified( "dependedUser" );
            owner.save(
              ( err ) => {
                if( err ) {
                  console.error( 
                            `ERROR: While Updating Secondary Owner "${
                                                                    owner._id
                                                                         .toString()
                                                                    }"!`
                          );
                }
              }
            );
          }
    
          //delete images of pet
          const emptyS3Directory = async ( bucket, dir ) => {
            const listParams = {
              Bucket: bucket,
              Prefix: dir
            };
            const listedObjects = await s3.listObjectsV2( listParams );
            if (
              !( listedObjects.Contents )
              || listedObjects.Contents
                              .length === 0
            ) return;
            const deleteParams = {
              Bucket: bucket,
              Delete: { Objects: [] }
            };
    
            listedObjects.Contents
                         .forEach(
                            ({ Key }) => {
                              deleteParams.Delete.Objects.push({ Key });
                            }
                          );
            await s3.deleteObjects( deleteParams );
            if ( listedObjects.IsTruncated ) await emptyS3Directory(bucket, dir);
          }
          
            emptyS3Directory( 
                  process.env
                         .BUCKET_NAME, 
                  
                  `pets/${petId}/`
            ).then(
              (_) => {
                //delete pet
                req.pet
                   .deleteOne()
                   .then(
                      (_) => {
                        return res.status( 200 )
                                  .json(
                                    {
                                      error: false,
                                      message: "Pet deleted succesfully"
                                    }
                                  );
                      }
                    ).catch(
                      ( error ) => {
                        console.log( error );
                          return res.status( 500 )
                                    .json(
                                      {
                                        error: true,
                                        message: "An error occured while deleting",
                                        error: error
                                      }
                                    );
                      }
                    );
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

export default deletePetController;