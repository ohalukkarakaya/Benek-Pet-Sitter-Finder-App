import cron from "node-cron";
import User from "../models/User.js"
import Pet from "../models/Pet.js"
import PetSecondaryOwnerInvitation from "../models/ownerOperations/SecondaryOwnerInvitation.js";
import PetHandOverInvitation from "../models/ownerOperations/PetHandOverInvitation.js";
import Event from "../models/Event/Event.js";
import EventTicket from "../models/Event/EventTicket.js";
import EventInvitation from "../models/Event/Invitations/InviteEvent.js";
import OrganizerInvitation from "../models/Event/Invitations/InviteOrganizer.js";
import DeletedUserRefund from "../models/DeletedUserRefund/DeletedUserRefund.js";
import Story from "../models/Story.js";

import s3 from "../utils/s3Service.js";
import dotenv from "dotenv";
import EventTicket from "../models/Event/EventTicket.js";

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
                                            await Promise.all(
                                                events.map(
                                                    async (meetingEvent) => {
                                                        //if user is event admin
                                                        if(meetingEvent.eventAdmin.toString() === user._id.toString()){
                                                            const eventId = meetingEvent._id.toString();
                                                            const soldTickets = await EventTicket.find({ eventId: eventId });
                                                            const cancelPayments = soldTickets.map(
                                                                (ticket) => {
                                                                    return new Promise(
                                                                        (resolve, reject) => {
                                                                            if(
                                                                                ticket.paidPrice.priceType !== "Free"
                                                                                && ticket.paidPrice.price > 0
                                                                            ){
                                                                                //To Do: cancel payment
                                                                            }

                                                                            ticket.deleteOne().then(
                                                                                (_) => {
                                                                                    return resolve(true);
                                                                                }
                                                                            ).catch(
                                                                                (error) => {
                                                                                    if(error){
                                                                                        console.log(error);
                                                                                    }
                                                                                }
                                                                            )
                                                                        }
                                                                    );
                                                                }
                                                            );
                                                            Promise.all(cancelPayments).then(
                                                                (_) => {
                                                                        //delete images of event
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
                                                                    emptyS3Directory(process.env.BUCKET_NAME, `events/${meetingEvent._id.toString()}/`).then(
                                                                        (_) => {
                                                                            //delete event
                                                                            meetingEvent.deleteOne().then(
                                                                                (_) => {
                                                                                    console.log("an event deleted because of user")
                                                                                }
                                                                            ).catch(
                                                                                (error) => {
                                                                                    console.log(error);
                                                                                }
                                                                            );
                                                                        }
                                                                    );
                                                                }
                                                            );
                                                        }else{
                                                            //if user is organizer
                                                            meetingEvent.eventOrganizers = meetingEvent.eventOrganizers.filter(
                                                                organizerId =>
                                                                    organizerId.toString() !== user._id.toString()
                                                            );
                                                            meetingEvent.markModified("eventOrganizers");

                                                            //check still if user has any post, comment or reply in event
                                                            await Promise.all(
                                                                meetingEvent.afterEvent.map(
                                                                    (afterEventObject) => {
                                                                        if(afterEventObject.userId.toString() === user._id.toString()){

                                                                          //delete content
                                                                          const areThereImgOnServer = afterEventObject.content.content.isUrl;
                                                                          if(areThereImgOnServer){
                                                                            const splitedUrl = content.content.value.split("/");
                                                                            imgName = splitedUrl[splitedUrl.length - 1];
                                                            
                                                                            const deleteImg = async (deleteParams) => {
                                                                                try {
                                                                                    s3.deleteObject(deleteParams).promise();
                                                                                    console.log("Success", data);
                                                                                    return data;
                                                                                } catch (err) {
                                                                                    console.log("Error", err);
                                                                                }
                                                                              };
                                                            
                                                                              const deleteContentImageParams = {
                                                                                Bucket: process.env.BUCKET_NAME,
                                                                                Key: `events/${req.eventId.toString()}/afterEventContents/${imgName}`
                                                                            };
                                                            
                                                                            await deleteImg(deleteContentImageParams);
                                                                          }

                                                                          //delete afterEvent
                                                                          meetingEvent.afterEvent = meetingEvent.afterEvent.filter(
                                                                            afterEvObj =>
                                                                                afterEvObj.userId.toString() !== afterEventObject.userId.toString()
                                                                          );
                                                                        }

                                                                        //delete afterEventLikes
                                                                        afterEventObject.likes.filter(
                                                                            like =>
                                                                                like.toString() !== user._id.toString()
                                                                        );

                                                                        //deleteComments
                                                                        await Promise.all(
                                                                            afterEventObject.comments.map(
                                                                                (commentObject) => {
                                                                                    if(commentObject.userId.toString() === user._id.toString()){
                                                                                        afterEventObject.comments.filter(
                                                                                            commentObj =>
                                                                                                commentObj.userId.toString() !== commentObject.userId.toString()
                                                                                        );
                                                                                    }

                                                                                    commentObject.likes = commentObject.likes.filter(
                                                                                        likedUser =>
                                                                                            likedUser.toString() !== user._id.toString()
                                                                                    );

                                                                                    await Promise.all(
                                                                                        commentObject.replies.map(
                                                                                            (replyObject) => {
                                                                                                if(replyObject.userId.toString() === user._id.toString()){
                                                                                                   commentObject.replies.filter(
                                                                                                    repObj =>
                                                                                                        repObj.userId.toString() !== replyObject.userId.toString()
                                                                                                   ); 
                                                                                                }

                                                                                                replyObject.likes = replyObject.likes.filter(
                                                                                                    likedUserId =>
                                                                                                        likedUserId.toString() !== user._id.toString()
                                                                                                );
                                                                                            }
                                                                                        )
                                                                                    );
                                                                                }
                                                                            )
                                                                        );
                                                                    }
                                                                )
                                                            );
                                                            meetingEvent.markModified("afterEvent");

                                                            //check if user was also joined guest
                                                            const didUserJoin = meetingEvent.joined.find(
                                                                userId =>
                                                                    userId.toString() === user._id.toString()
                                                            );
                                                            if(didUserJoin){
                                                                meetingEvent.joined = meetingEvent.joined.filter(
                                                                    userId =>
                                                                        userId.toString() !== user._id.toString()
                                                                );
                                                                meetingEvent.markModified("joined");
                                                            }

                                                            //check if user was also bought ticket
                                                            const didUserBoughtTicket = meetingEvent.willJoin = meetingEvent.willJoin.finf(
                                                                userId =>
                                                                    userId.toString() === user._id.toString()
                                                            );
                                                            if(didUserBoughtTicket){
                                                                meetingEvent.willJoin = meetingEvent.willJoin.filter(
                                                                    userId =>
                                                                        userId.toString() !== user._id.toString()
                                                                );
                                                                meetingEvent.markModified("willJoin");
                                                            }

                                                            meetingEvent.save(
                                                                (err) => {
                                                                    if(err){
                                                                        console.log(err);
                                                                    }
                                                                }
                                                            );
                                                        }
                                                    }
                                                )
                                            );
                                        }
                                    }
                                ).then(
                                    (_) => {
                                        //delete bought event tickets
                                        await EventTicket.find(
                                            {
                                                userId: user._id.toString()
                                            }
                                        ).exec(
                                            (err, ticket) => {
                                                if(err){
                                                    console.log(err);
                                                }

                                                if(ticket){
                                                    if(ticket.paidPrice.priceType === "Free" && ticket.paidPrice.price === 0){
                                                        //delete event
                                                        ticket.deleteOne().then(
                                                            (_) => {
                                                                console.log("an event ticket deleted because of user")
                                                            }
                                                        ).catch(
                                                            (error) => {
                                                                console.log(error);
                                                            }
                                                        );
                                                    }else{
                                                        //keep money for one year
                                                        const emailsPastRefund = await DeletedUserRefund.findOne(
                                                            {
                                                                email: user.email
                                                            }
                                                        );
                                                        if(emailsPastRefund){
                                                            emailsPastRefund.refundPrice.price = emailsPastRefund.refundPrice.price + ticket.paidPrice.price;
                                                            emailsPastRefund.markModified("refundPrice");
                                                            emailsPastRefund.save(
                                                                (err) => {
                                                                    if(err){
                                                                        console.log(err);
                                                                    }
                                                                }
                                                            );
                                                        }else{
                                                            await new DeletedUserRefund(
                                                                {
                                                                    email: user.email,
                                                                    refundPrice: {
                                                                        price: ticket.paidPrice.price
                                                                    }
                                                                }
                                                            ).save(
                                                                (err) => {
                                                                    if(err){
                                                                        console.log(err);
                                                                    }
                                                                }
                                                            ).then(
                                                                (newRefund) => {
                                                                    console.log(`new refund with id: ${newRefund._id.toString()} inserted`);
                                                                }
                                                            );
                                                        }
                                                    }
                                                    ticket.deleteOne().then(
                                                        (_) => {
                                                            console.log("an event ticket deleted because of user")
                                                        }
                                                    ).catch(
                                                        (error) => {
                                                            console.log(error);
                                                        }
                                                    );
                                                }
                                            }
                                        ).then(
                                            (_) => {

                                            }
                                        );
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