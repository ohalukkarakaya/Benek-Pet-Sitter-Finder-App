import cron from "node-cron";
import User from "../models/User.js"
import Pet from "../models/Pet.js"
import PetSecondaryOwnerInvitation from "../models/ownerOperations/SecondaryOwnerInvitation.js";
import PetHandOverInvitation from "../models/ownerOperations/PetHandOverInvitation.js";
import Event from "../models/Event/Event.js";
import Story from "../models/Story.js";

import s3 from "../utils/s3Service.js";
import dotenv from "dotenv";

dotenv.config();

const expireUser = cron.schedule(
    '0 0 * * *',
    async () => {
        try{
            User.find(
                {
                    "deactivation.isDeactive": true,
                    "deactivation.deactivationDate": { $lt: Date.now() - 2592000000 },
                    "deactivation.isAboutToDelete": true
                }
            ).exec(
                (err, users) => {
                    if(err){
                        console.log(err);
                    }
                    if(users){
                        users.map(
                            async (user) => {
                                //delete pets
                                await Promise.all(
                                    user.pets.map(
                                        async (petId) => {
                                            const pet = await Pet.findById(petId.toString());
                                            const petFollowers = pet.followers;
                                            const allOwners = pet.allOwners.filter(owner => owner.toString() !== pet.primaryOwner.toString());

                                            await PetSecondaryOwnerInvitation.deleteMany({ petId: pet._id.toString() });
                                            await PetHandOverInvitation.deleteMany({ petId: pet._id.toString() });

                                            //clean followers follow event
                                            for(var i = 0; i < petFollowers.length; i ++){
                                                follower = await User.findById(petFollowers[i]);
                                                follower.followingUsersOrPets = follower.followingUsersOrPets.filter(
                                                    followingObject =>
                                                        followingObject.followingId.toString() !== petId
                                                );
                                                follower.markModified("followingUsersOrPets");
                                                follower.save(
                                                    (err) => {
                                                        if(err){
                                                            console.log(err);
                                                        }
                                                    }
                                                );
                                            }

                                            //clean dependency of secondary owners
                                            for(var i = 0; i < allOwners.length; i ++){
                                                const ownerId = allOwners[i].toString();
                                                const owner = await User.findById(ownerId);
                                                const deps = owner.dependedUsers;

                                                for(var indx = 0; indx < deps.length; indx ++){
                                                    if(deps[indx].user.toString() === pet.primaryOwner.toString()){
                                                        const linkedPets = deps[indx].linkedPets;
                                                        if(linkedPets.length > 1){
                                                            owner.dependedUsers[indx].linkedPets = owner.dependedUsers[indx].linkedPets.filter(pets => pets.toString() !==  pet._id.toString() );
                                                        }else{
                                                            owner.dependedUsers = owner.dependedUsers.filter(dependeds => dependeds !== deps[indx]);
                                                        }
                                                    }
                                                }

                                                owner.markModified("dependedUser");
                                                owner.save(
                                                    function (err) {
                                                        if(err) {
                                                            console.error(`ERROR: While Updating Secondary Owner "${owner._id.toString()}"!`);
                                                        }
                                                    }
                                                );
                                            }

                                            //delete images of pet
                                            async function emptyS3Directory(bucket, dir){
                                                const listParams = {
                                                    Bucket: bucket,
                                                    Prefix: dir
                                                };
                                                const listedObjects = await s3.listObjectsV2(listParams);
                                                if (listedObjects.Contents.length === 0) return;
                                                const deleteParams = {
                                                    Bucket: bucket,
                                                    Delete: { Objects: [] }
                                                };

                                                listedObjects.Contents.forEach(({ Key }) => {
                                                    deleteParams.Delete.Objects.push({ Key });
                                                });
                                                await s3.deleteObjects(deleteParams);
                                                if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
                                            }

                                            emptyS3Directory(process.env.BUCKET_NAME, `pets/${petId}/`).then(
                                                (_) => {
                                                  //delete pet
                                                  pet.deleteOne().then(
                                                    (_) => {
                                                      console.log("A pet deleted because of owner");
                                                    }
                                                  ).catch(
                                                    (error) => {
                                                      console.log(error);
                                                    }
                                                  );
                                                }
                                            );
                                        }
                                    )
                                );

                                //delete events or event interractions
                                await Event.find(
                                    {
                                        $and: [
                                            {
                                                date: { $lt: Date.now() }
                                            },
                                            {
                                                $or: [
                                                 { eventAdmin: user._id.toString() },
                                                 { eventOrganizers: { $in: [ user._id.toString() ] }},
                                                 { willJoin: { $in: [ user._id.toString() ] } },
                                                 { joined: { $in: [ user._id.toString() ] } },
                                                 { "afterEvent.userId": user._id.toString() },
                                                 { "afterEvent.likes": { $in: [ user._id.toString() ] } },
                                                 { "afterEvent.comments.userId": user._id.toString() },
                                                 { "afterEvent.comments.likes": { $in: [ user._id.toString() ] } },
                                                 { "afterEvent.comments.replies.userId": user._id.toString() },
                                                 { "afterEvent.comments.replies.likes": { $in: [ user._id.toString() ] } },
                                                ] 
                                             }
                                        ]
                                    }
                                ).exec(
                                    (err, events) => {
                                        if(err){
                                            console.log(err);
                                        }
                                        if(events){
                                            //To Do: delete events with all conditions
                                        }
                                    }
                                );
                            }
                        );
                    }
                }
            );
        }catch(err){
            console.log(err);
        }
    }
);

export default expireStories;