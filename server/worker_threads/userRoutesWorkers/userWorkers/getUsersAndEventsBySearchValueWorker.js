import User from "../../../models/User";
import Pet from "../../../models/Pet";

import getLightWeightUserInfoHelper from "../../../utils/getLightWeightUserInfoHelper.js";

const getUsersAndEventsBySearchValueWorker = async ( message ) => {

    const skip = message.payload
                        .skip;

    const limit = message.payload
                         .limit;

    const mergedList = message.payload
                              .list;
    for(
        var item
        of mergedList
    ){
        if( item instanceof User ) {
            const { location } = item;
            const distance = Math.sqrt(
                                    Math.pow(
                                            location.lat - lat, 
                                            2
                                        ) 
                                    + Math.pow(
                                            location.lng - lng, 
                                            2
                                          )
                                  );
            item.distance = distance;
            
            for(
                let petId
                of item.pets
            ){
                const pet = await Pet.findById( petId.toString() );
                const petInfo = {
                    petId: petId.toString(),
                    petProfileImgUrl: pet.petProfileImg
                                         .imgUrl,
                    petName: pet.name
                }
                petId = petInfo;
            }

            delete item.password;
            delete item.iban;
            delete item.cardGuidies;
            delete item.trustedIps;
            delete item.blockedUsers;
            delete item.saved;
            delete item.identity.nationalId;
            delete item.identity.openAdress;
            delete item.phone;
            delete item.email;

            for(
                let dependedId
                of item.dependedUsers
            ){
                const depended = await User.findById( dependedId );
                const dependedInfo = getLightWeightUserInfoHelper( depended );
                dependedId = dependedInfo;
            }

            const starValues = item.stars
                                   .map(
                                        starObject => 
                                                starObject.star 
                                    );

            const totalStarValue = starValues.reduce(
                                                ( acc, curr ) =>
                                                            acc + curr, 
                                                            0
                                              );
            const starCount = item.stars
                                  .length;

            const starAvarage = totalStarValue / starCount;

            item.totalStar = starCount;
            item.stars = starAvarage;

        }else if( item instanceof Event ) {
            const { adress } = item;
            const distance = Math.sqrt(
                Math.pow(
                        adress.lat - lat, 
                        2
                    ) 
                + Math.pow(
                        adress.long - lng, 
                        2
                    )
            );
            item.distance = distance;

            const eventAdmin = await User.findById( 
                                                item.eventAdmin
                                                    .toString() 
                                          );

            const eventAdminInfo = {
                userId: eventAdmin._id.toString(),
                userProfileImg: eventAdmin.profileImg.imgUrl,
                username: eventAdmin.userName,
                userFullName: `${
                        eventAdmin.identity
                                  .firstName
                    } ${
                        eventAdmin.identity
                                  .middleName
                    } ${
                        eventAdmin.identity
                                  .lastName
                    }`.replaceAll( "  ", " ")
            }
            item.eventAdmin = eventAdminInfo;

            for(
                let organizerId
                of item.eventOrganizers
            ){
                const organizer = await User.finfById( 
                                                organizerId.toString() 
                                             );

                const organizerInfo = {
                    userId: organizer._id
                                     .toString(),
                    userProfileImg: organizer.profileImg
                                             .imgUrl,
                    username: organizer.userName,
                    userFullName: `${
                            organizer.identity
                                     .firstName
                        } ${
                            organizer.identity
                                     .middleName
                        } ${
                            organizer.identity
                                     .lastName
                        }`.replaceAll( "  ", " ")
                }
                item.organizers.push( organizerInfo );
            }

            if( 
                item.organizers
                    .length === item.eventOrganizers
                                    .length 
            ){
                delete item.eventOrganizers
            }

            for(
                let joiningUserId
                of item.willJoin
            ){
                const joiningUser = await User.findById( joiningUserId );
                const usersWhoWillJoinInfo = {
                    userId: joiningUserId,
                    userProfileImg: joiningUser.profileImg
                                               .imgUrl,
                    username: joiningUser.userName,
                    usersFullName: `${
                            joiningUser.identity
                                       .firstName
                        } ${
                            joiningUser.identity
                                       .middleName
                        } ${
                            joiningUser.identity
                                       .lastName
                        }`.replaceAll( "  ", " ")
                }

                item.usersWhoWillJoin
                    .push( usersWhoWillJoinInfo );
            }
            
            if( 
                item.usersWhoWillJoin
                    .length === item.willJoin
                                    .length 
            ){
                delete item.willJoin;
            }
        }
    }

    mergedList.sort(
                    ( a, b ) => 
                            a.distance - b.distance
               );

    const resultList = mergedList.slice(
                                        skip, 
                                        skip + limit
                                  );

    parentPort.postMessage(
                    {
                        type: "success",
                        payload: {
                            error: false,
                            message: "discover screen users and events list is prepared succesfully",
                            dataList: resultList,
                        }
                    }
               );
}

export default getUsersAndEventsBySearchValueWorker;