import cron from "node-cron";
import dotenv from "dotenv";

import User from "../models/User.js";
import PunishmentRecord from "../models/Report/PunishmentRecord.js";
import BannedUsers from "../models/Report/BannedUsers.js";
import Pet from "../models/Pet.js";
import PetSecondaryOwnerInvitation from "../models/ownerOperations/SecondaryOwnerInvitation.js";
import PetHandOverInvitation from "../models/ownerOperations/PetHandOverInvitation.js";
import Event from "../models/Event/Event.js";
import EventTicket from "../models/Event/EventTicket.js";
import EventInvitation from "../models/Event/Invitations/InviteEvent.js";
import OrganizerInvitation from "../models/Event/Invitations/InviteOrganizer.js";
import CareGive from "../models/CareGive/CareGive.js";
import ReportedMission from "../models/Report/ReportMission.js";
import Story from "../models/Story.js";
import ChangeEmailModel from "../models/UserSettings/ChangeEmail.js";
import PhoneOtpVerificationModel from "../models/UserSettings/PhoneOTPVerification.js";


import mokaVoid3dPaymentRequest from "../utils/mokaPosRequests/mokaPayRequests/mokaVoid3dPaymentRequest.js";
import deleteFileHelper from "../utils/fileHelpers/deleteFileHelper.js";
import getLightWeightUserInfoHelper from "../utils/getLightWeightUserInfoHelper.js";
import canDeleteUser from "../utils/adminHelpers/canDeleteUserHelper.js";
import BanUserASAPRecord from "../models/Report/BanUserASAPRecord.js";

dotenv.config();

// - tested
const expireUser = cron.schedule(
    '0 0 * * *', // hergün gece 12:00
    // "* * * * *", // her dakika başı
    async () => {
        try{
            //pull punishment records and ban users with over punishment record
            const users = await User.find({ "deactivation.isDeactive": true, "deactivation.deactivationDate": { $lt: Date.now() - 2592000000 }, "deactivation.isAboutToDelete": true });

            const banUserASAPRecords = await BanUserASAPRecord.find({ "banDate": { $lt: Date.now() } });
            for( const banRecord of banUserASAPRecords ){
                const banRecordUser = await User.findById( banRecord.userId );
                const isUserDeletable = await canDeleteUser( banRecord.userId );
                if( !banRecordUser || !isUserDeletable ){
                    continue;
                }

                const isUserInUsersArray = users.some(
                    user =>
                        user._id.toString() === banRecord.userId.toString()
                );
                if( !isUserInUsersArray ){
                    users.push( banRecordUser );
                }

                const isUserAlreadyBanned = await BannedUsers.findOne({ userEmail: banRecordUser.email });
                if( !isUserAlreadyBanned ){
                    const banRecordUserInfo = getLightWeightUserInfoHelper( banRecordUser );
                    await new BannedUsers(
                        {
                            adminId: banRecord.adminId,
                            userEmail: banRecordUser.email,
                            userPhoneNumber: banRecordUser.phone,
                            userFullName: banRecordUserInfo.userFullName,
                            adminDesc: "User Banned Because Of Over Punishment Record"
                        }
                    ).save();
                }

                banRecord.deleteOne();
            }

            const punishmentRecords = await PunishmentRecord.find({
                $expr: { $gte: [{ $size: "$punishmentList" }, 3] }
            });
            for( const punishment of punishmentRecords ){

                const punishedUser = await User.findById( punishment.userId );
                const isUserDeletable = await canDeleteUser( punishment.userId );

                if( !punishedUser || !isUserDeletable ){
                    let pastBanRequestRecord = await BanUserASAPRecord.findOne({ userId: punishment.userId });
                    if( !pastBanRequestRecord ){
                        await new BanUserASAPRecord({
                            adminId: punishment.punishmentList[ punishment.punishmentList.length -1 ].adminId.toString(),
                            userId: punishment.userId,
                            banReason: "User Banned Because Of Over Punishment Record"
                        }).save();
                    }

                    continue;
                }
                const isUserInUsersArray = users.some( 
                    user => 
                        user._id.toString() === punishedUser._id.toString() 
                );
                if( !isUserInUsersArray ){ 
                    users.push( punishedUser ); 
                }

                const isUserAlreadyBanned = await BannedUsers.findOne({ userEmail: punishedUser.email });
                if( !isUserAlreadyBanned ){
                    const punishedUserInfo = getLightWeightUserInfoHelper( punishedUser );
                    await new BannedUsers(
                        { 
                            adminId: punishment.punishmentList[ punishment.punishmentList.length -1 ].adminId.toString(), 
                            userEmail: punishedUser.email, 
                            userPhoneNumber: punishedUser.phone, 
                            userFullName: punishedUserInfo.userFullName, 
                            adminDesc: "User Banned Because Of Over Punishment Record" 
                        }
                    ).save();
                }

                punishment.deleteOne();
            }

            if( users ){
                users.map( async ( user ) => {
                    //delete pets
                    await Promise.all(
                        user.pets.map(
                            async ( petId ) => {
                                const pet = await Pet.findById( petId.toString() );
                                const petFollowers = pet.followers;
                                const allOwners = pet.allOwners.filter( 
                                    owner => 
                                        owner.toString() !== pet.primaryOwner.toString() 
                                );

                                await PetSecondaryOwnerInvitation.deleteMany({ petId: pet._id.toString() });
                                await PetHandOverInvitation.deleteMany({ petId: pet._id.toString() });

                                //clean followers follow event
                                for( var i = 0; i < petFollowers.length; i ++ ){
                                    let follower = await User.findById( petFollowers[ i ] );
                                    follower.followingUsersOrPets = follower.followingUsersOrPets.filter( 
                                        followingObject => 
                                            followingObject.followingId.toString() !== petId 
                                    );
                                    follower.markModified("followingUsersOrPets");
                                    follower.save( 
                                        ( err ) => { 
                                            if( err ){ 
                                                console.log( err ); 
                                            } 
                                        }
                                    );
                                }

                                //clean dependency of secondary owners
                                for( var i = 0; i < allOwners.length; i ++ ){
                                    const ownerId = allOwners[ i ].toString();
                                    const owner = await User.findById( ownerId );
                                    const deps = owner.dependedUsers;

                                    for( var indx = 0; indx < deps.length; indx ++ ){
                                        if( deps[ indx ].user.toString() === pet.primaryOwner.toString() ){
                                            const linkedPets = deps[ indx ].linkedPets;
                                            if( linkedPets.length > 1 ){
                                                owner.dependedUsers[ indx ].linkedPets = owner.dependedUsers[ indx ].linkedPets.filter( 
                                                                                            pets => 
                                                                                                pets.toString() !==  pet._id.toString() 
                                                                                         ); 
                                            }else{ 
                                                owner.dependedUsers = owner.dependedUsers.filter( 
                                                                        dependeds => 
                                                                            dependeds !== deps[ indx ] 
                                                                      ); 
                                            }
                                        }
                                    }

                                    owner.markModified( "dependedUser" );
                                    owner.save(
                                        ( err ) => { 
                                            if( err ){ 
                                                console.log( `ERROR: While Updating Secondary Owner "${owner._id.toString()}"!` ); 
                                            }
                                        }
                                    );
                                }

                                //delete images of pet
                                deleteFileHelper( `pets/${petId}/` ).then( 
                                    (_) => {
                                        // delete pet
                                        pet.deleteOne().then( 
                                            (_) => { 
                                                onsole.log( "A pet deleted because of owner" ); 
                                            }
                                        ).catch( 
                                            ( error ) => { 
                                                console.log( error ); 
                                            } 
                                        );
                                    }
                                );
                            }
                        )
                    );

                    //delete events or event interractions
                    const events = await Event.find({
                        $and: [
                            { date: { $lt: Date.now() } },
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
                    });

                    if( events ){
                        // delete events with all conditions
                        await Promise.all( events.map( async ( meetingEvent ) => {
                            //if user is event admin
                            if( meetingEvent.eventAdmin.toString() === user._id.toString() ){

                                const eventId = meetingEvent._id.toString();
                                const soldTickets = await EventTicket.find({ eventId: eventId });

                                const cancelPayments = soldTickets.map(( ticket ) => {

                                    return new Promise( async (resolve, reject) => {
                                        if( ticket.paidPrice.priceType !== "Free" && ticket.paidPrice.price > 0 && ticket.orderId && ticket.orderInfo && ticket.orderInfo.pySiparisGuid ){
                                            //cancel payment 
                                            const cancelPayment = await mokaVoid3dPaymentRequest( ticket.orderId.virtualPosOrderId );
                                            if( 
                                                !cancelPayment 
                                                || (  
                                                    cancelPayment.serverStatus && cancelPayment.serverStatus !== 0 && cancelPayment.serverStatus !== 1
                                                    && ( cancelPayment.error === true || !( cancelPayment.data ) )
                                                )
                                            ){  
                                                return reject( false ); 
                                            }
                                        }
                                        ticket.deleteOne().then( 
                                            (_) => { 
                                                return resolve( true ); 
                                            }
                                        ).catch( 
                                            ( error ) => { 
                                                if( error ){ 
                                                    console.log(error); 
                                                } 
                                            } 
                                        );
                                    });
                                });

                                Promise.all( cancelPayments ).then((_) => {
                                    //delete images of event
                                    deleteFileHelper( `events/${meetingEvent._id.toString()}/` ).then(
                                        (_) => {
                                            //delete event
                                            meetingEvent.deleteOne().then(
                                                (_) => { 
                                                    console.log("an event deleted because of user") 
                                                }
                                            ).catch(
                                                ( error ) => { 
                                                    console.log( error ); 
                                                }
                                            );
                                        }
                                    );
                                });

                            }else{
                                //if user is organizer
                                meetingEvent.eventOrganizers = meetingEvent.eventOrganizers.filter(
                                    organizerId =>
                                        organizerId.toString() !== user._id.toString()
                                );
                                meetingEvent.markModified("eventOrganizers");

                                //check if user still has any post, comment or reply in event
                                await Promise.all( meetingEvent.afterEvent.map( async ( afterEventObject ) => {
                                    if( afterEventObject.userId.toString() === user._id.toString() ){
                                        //delete content
                                        const areThereImgOnServer = afterEventObject.content.content.isUrl;
                                        if( areThereImgOnServer){
                                            const contentUrl = afterEventObject.content.content.value;
                                            deleteFileHelper( contentUrl ).then((_) => {
                                                //delete event
                                                meetingEvent.deleteOne().then(
                                                    (_) => { 
                                                        console.log("an after event content deleted because of user") 
                                                    }
                                                ).catch(
                                                    ( error ) => { 
                                                        console.log( error ); 
                                                    }
                                                );
                                            });
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
                                    await Promise.all( afterEventObject.comments.map( async ( commentObject ) => {
                                        if( commentObject.userId.toString() === user._id.toString() ){ 
                                            afterEventObject.comments.filter(  
                                                commentObj => 
                                                    commentObj.userId.toString() !== commentObject.userId.toString() 
                                            ); 
                                        }

                                        commentObject.likes = commentObject.likes.filter( 
                                            likedUser => 
                                                likedUser.toString() !== user._id.toString() 
                                        );

                                        await Promise.all( commentObject.replies.map( ( replyObject ) => {
                                            if( replyObject.userId.toString() === user._id.toString() ){ 
                                                commentObject.replies = commentObject.replies.filter( 
                                                    repObj => 
                                                        repObj.userId.toString() !== replyObject.userId.toString() 
                                                ); 
                                            }
                                            replyObject.likes = replyObject.likes.filter( 
                                                likedUserId => 
                                                    likedUserId.toString() !== user._id.toString() 
                                            );
                                        }));
                                    }));
                                }));
                                meetingEvent.markModified("afterEvent");

                                //check if user was also joined guest
                                const didUserJoin = meetingEvent.joined.find( userId => userId.toString() === user._id.toString() );
                                if( didUserJoin ){
                                    meetingEvent.joined = meetingEvent.joined.filter( 
                                        userId => 
                                            userId.toString() !== user._id.toString() 
                                    );
                                    meetingEvent.markModified("joined");
                                }

                                //check if user was also bought ticket
                                const didUserBoughtTicket = meetingEvent.willJoin = meetingEvent.willJoin.find( 
                                    userId => 
                                        userId.toString() === user._id.toString() 
                                );

                                if( didUserBoughtTicket ){
                                    meetingEvent.willJoin = meetingEvent.willJoin.filter( 
                                        userId => 
                                            userId.toString() !== user._id.toString() 
                                    );
                                    meetingEvent.markModified("willJoin");
                                }

                                meetingEvent.save(
                                    ( err ) => { 
                                        if( err ){ 
                                            console.log( err ); } 
                                    }
                                );
                            }
                        }));
                    }

                    //delete bought event tickets
                    const tickets = await EventTicket.find({ userId: user._id.toString() });
                    if( tickets.length > 0 ){
                        for( let ticket of tickets){
                            if( ticket.paidPrice.priceType !== "Free" && ticket.paidPrice.price > 0 ){
                                //cancel payment
                                const cancelPayment = await mokaVoid3dPaymentRequest( ticket.orderId.virtualPosOrderId );
                                if( 
                                    !cancelPayment 
                                    || (  
                                        cancelPayment.serverStatus && cancelPayment.serverStatus !== 0 && cancelPayment.serverStatus !== 1
                                        && ( cancelPayment.error === true || !( cancelPayment.data ) )
                                    )
                                ){ console.log( 'ERROR' ); }
                            }
                            ticket.deleteOne().then(
                                (_) => { 
                                    console.log( "an event ticket deleted because of user" )
                                }
                            ).catch(
                                ( error ) => { 
                                    console.log( error ); 
                                }
                            );
                        }
                    }

                    const eventInvitation = await EventInvitation.find(
                        { 
                            $or: [
                                { invitedId: user._id.toString() }, 
                                { eventAdminId: user._id.toString() }
                            ]
                        }
                    );

                    if( eventInvitation ){ 
                        await Promise.all( 
                            eventInvitation.map(( invitation ) => { 
                                invitation.deleteOne().then().catch(
                                    ( err ) => { 
                                        if( err ){ 
                                            console.log( err ); 
                                        } 
                                    }
                                ); 
                            })
                        ); 
                    }

                    const organizerInvitation = await OrganizerInvitation.find(
                        { 
                            $or: [
                                { invitedId: user._id.toString() }, 
                                { eventAdminId: user._id.toString() }
                            ]
                        }
                    );
                    if( organizerInvitation ){ 
                        await Promise.all( 
                            organizerInvitation.map( 
                                ( invitation ) => { 
                                    invitation.deleteOne().then().catch(( err ) => { if( err ){ console.log( err ); }}); 
                                }
                            )
                        ); 
                    }

                    //check if there is finished care give and delete if there is
                    const careGives = await CareGive.find(
                        { 
                            $and: [
                                { "finishProcess.isFinished": true }, 
                                { 
                                    $or: [
                                        { "careGiver.careGiverId": user._id.toString() }, 
                                        { "petOwner.petOwnerId": user._id.toString() }
                                    ] 
                                }
                            ]
                        }
                    );
                    
                    if( careGives ){
                        await Promise.all( careGives.map( async ( careGive ) => {
                            const isCareGiveReported = await ReportedMission.find( 
                                reportedMissionObject => 
                                    reportedMissionObject.careGiveId.toString() === careGive._id.toString()
                            );

                            if( !isCareGiveReported ){
                                //delete images of careGive
                                deleteFileHelper( `careGive/${careGive._id.toString()}/` ) //delete CareGive
                                    .then((_) => { careGive.deleteOne().then((_) => { console.log("deleted an expired Care Give"); })
                                    .catch(( error ) => { console.log( error ); }); });
                            }
                        }));
                    }

                    //delete stories
                    const stories = await Story.find({ userId: user._id.toString() });
                    if( stories ){  
                        await Promise.all( stories.map(( story ) => { 
                            story.deleteOne().then(
                                (_) => { 
                                    console.log("deleted an expired story"); 
                                }
                            ).catch(
                                ( error ) => { 
                                    console.log( error ); 
                                }
                            ); 
                        })); 
                    }

                    //delete user settings models
                    await ChangeEmailModel.deleteMany({ userId: user._id.toString() });
                    await PhoneOtpVerificationModel.deleteMany({ userId: user._id.toString() });

                    //delete user
                    //delete images of user
                    deleteFileHelper( `profileAssets/${user._id.toString()}/` ).then( async (_) => {
                        //delete user
                        user.deleteOne().then(
                            (_) => {
                                console.log( "deleted an expired User" ); 
                            }
                        ).catch(
                            ( error ) => { 
                                console.log( error ); 
                            }
                        );
                    });
                });
            }
        }catch( err ){ 
            console.log( "ERROR: expireUser - ", err );
        }
    }
);

export default expireUser;