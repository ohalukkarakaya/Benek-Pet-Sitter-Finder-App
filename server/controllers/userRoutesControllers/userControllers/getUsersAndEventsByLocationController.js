import User from "../../../models/User.js";
import Event from "../../../models/Event/Event.js";
import Pet from "../../../models/Pet.js";
import getLightWeightPetInfoHelper from "../../../utils/getLightWeightPetInfoHelper.js";
import getLightWeightUserInfoHelper from "../../../utils/getLightWeightUserInfoHelper.js";

const getUsersAndEventsByLocationController = async ( req, res) => {
    try{
        const lat = parseFloat( req.body.lat );
        const lng = parseFloat( req.body.lng );
        const limit = req.params.limit || 10;
        const lastItemId = req.body.lastItemId || 'null';
        const userId = req.user._id.toString();

        if( !lat || !lng ){
            return res.status( 400 ).json({
                error: true,
                message: "missing params"
            });
        }
    
        let users = await User.aggregate(
            [
                {
                    $addFields: {
                        starsCount: { 
                            $cond: [ 
                                { $isArray: "$stars.star" }, 
                                { $size: "$stars.star" }, 
                                0 
                            ] 
                        },
                        followersCount: { 
                            $cond: [ 
                                { $isArray: "$followers" }, 
                                { $size: "$followers" }, 
                                0 
                            ] 
                        },
                        followingUsersOrPetsCount: { 
                            $cond: [ 
                                { $isArray: "$followingUsersOrPets" }, 
                                { $size: "$followingUsersOrPets"  }, 
                                0 
                            ] 
                        },
                        caregiverCareerCount: { 
                            $cond: [ 
                                { $isArray: "$caregiverCareer" }, 
                                { $size: "$caregiverCareer" }, 
                                0 
                            ] 
                        },
                        pastCaregiversCount: { 
                            $cond: [ 
                                { $isArray: "$pastCaregivers" }, 
                                { $size: "$pastCaregivers" }, 
                                0 
                            ] 
                        },
                    }
                },
                // Kullanıcıları stars, followers, followingUsersOrPets, caregiverCareer ve pastCaregivers
                // değerlerine göre tekrar sırala
                {
                    $sort: {
                        starsCount: -1,
                        followersCount: -1,
                        followingUsersOrPetsCount: 1,
                        caregiverCareerCount: -1,
                        pastCaregiversCount: -1,
                    },
                },
                {
                    // İstek yapılan konum ile kullanıcı konumları arasındaki mesafeyi hesapla
                    $addFields: {
                        distance: {
                            $sqrt: {
                                $add: [
                                    { 
                                        $pow: [ 
                                            { 
                                                $subtract: 
                                                    [
                                                        lat, 
                                                        "$location.lat"
                                                    ] 
                                            }, 
                                            2 
                                        ] 
                                    },
                                    {
                                        $pow: [ 
                                            { 
                                                $subtract: 
                                                    [
                                                        lng, 
                                                        "$location.lng"
                                                    ] 
                                            },
                                            2 
                                        ] 
                                    },
                                ],
                            },
                        },
                    },
                },
                // En yakın kullanıcılara öncelik ver
                { 
                    $sort: { 
                        distance: 1 
                    } 
                },
                // deactivation kaydı kontrol et ve geçersiz kullanıcıları atla
                {
                    $match: {
                        "deactivation.isDeactive": false,
                        blockedUsers: { $nin: [ userId ] },
                    },
                },
            ]
        );

        users = users.filter(
            ( user ) =>
                user._id
                    .toString() != userId
        );

        for(let user of users ){
            user.type = 'user';
        }
        
        // prepare events
        let events = await Event.find(
            {
                isPrivate: false,
                "adress.lat": { $exists: true },
                "adress.long": { $exists: true },
                date: { $gte: new Date() }
            }
        ).sort(
            {
                "adress.lat": 1,
                "adress.long": 1,
                date: 1,
            }
        );

        events = events.filter(
            ( event ) => {
                if( event.maxGuests !== -1 ){
                    return event.maxGuests >= event.willJoin.length;
                }else{
                    return true
                }
            }
        );

        for(let event of events ){
            event.type = 'event';
        }

        const sortedEvents = events.map(
            ( event ) => {
                const distance = Math.pow( event.adress.lat - lat, 2 ) + Math.pow( event.adress.long - lng, 2 );
                return { ...event.toObject(), distance };
            }
        ).sort(
            ( a, b ) => 
                a.distance - b.distance
        );

        const mergedList = [...users, ...sortedEvents];

        for( let item of mergedList ){
            if( item.type === 'user' ){
                const { location } = item;
                const distance = Math.sqrt( Math.pow( location.lat - lat, 2 ) + Math.pow( location.lng - lng, 2 ) );
                item.distance = distance;
                
                for( let petId of item.pets ){
                    const pet = await Pet.findById( petId.toString() );
                    const petInfo = getLightWeightPetInfoHelper( pet );
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

                delete item.careGiveGUID;
                delete item.__v;
                delete item.createdAt;
                delete item.updatedAt;
                delete item.type;
                delete item.isLoggedInIpTrusted;
                delete item.deactivation;
                delete item.isEmailVerified;
                delete item.isPhoneVerified;
                delete item.location;

                delete item.identity.nationalId;
                delete item.identity.openAdress;
                delete item.identity.birthday;

    
                for( let dependedId  of item.dependedUsers ){
                    const depended = await User.findById( dependedId );
                    const dependedInfo = getLightWeightUserInfoHelper( depended );
                    
                    dependedId = dependedInfo;
                }
    
                const starValues = item.stars.map( starObject => starObject.star );
                const totalStarValue = starValues.reduce(
                    ( acc, curr ) =>
                            acc + curr, 0
                );
                const starCount = item.stars.length;
                const starAvarage = totalStarValue / starCount;
    
                item.totalStar = starCount;
                item.stars = starAvarage;
    
            }else if( item.type == 'event' ) {
                const { adress } = item;
                const distance = Math.sqrt(  Math.pow( adress.lat - lat, 2 ) + Math.pow( adress.long - lng, 2 ) );
                item.distance = distance;
    
                const eventAdmin = await User.findById( item.eventAdmin.toString() );
                const eventAdminInfo = {
                    userId: eventAdmin._id.toString(),
                    isProfileImageDefault: eventAdmin.profileImg.isDefaultImg,
                    userProfileImg: eventAdmin.profileImg.imgUrl,
                    username: eventAdmin.userName,
                    userFullName: `${eventAdmin.identity.firstName} ${eventAdmin.identity.middleName} ${eventAdmin.identity.lastName}`.replaceAll( "  ", " ")
                }
                item.eventAdmin = eventAdminInfo;
    
                for( let organizerId of item.eventOrganizers ){
                    const organizer = await User.finfById( organizerId.toString() );
                    const organizerInfo = {
                        userId: organizer._id.toString(),
                        isProfileImageDefault: organizer.profileImg.isDefaultImg,
                        userProfileImg: organizer.profileImg.imgUrl,
                        username: organizer.userName,
                        userFullName: `${organizer.identity.firstName} ${organizer.identity.middleName} ${organizer.identity.lastName }`.replaceAll( "  ", " " )
                    }
                    item.organizers.push( organizerInfo );
                }
    
                if( item.organizers.length === item.eventOrganizers.length ){
                    delete item.eventOrganizers
                }
    
                for( let joiningUserId of item.willJoin ){
                    const joiningUser = await User.findById( joiningUserId );
                    const usersWhoWillJoinInfo = {
                        userId: joiningUserId,
                        isProfileImageDefault: joiningUser.profileImg.isDefaultImg,
                        userProfileImg: joiningUser.profileImg.imgUrl,
                        username: joiningUser.userName,
                        usersFullName: `${joiningUser.identity.firstName} ${joiningUser.identity.middleName} ${joiningUser.identity.lastName}`.replaceAll( "  ", " " )
                    }
                    item.usersWhoWillJoin.push( usersWhoWillJoinInfo );
                }
                
                if( item.usersWhoWillJoin.length === item.willJoin.length ){
                    delete item.willJoin;
                }
            }
        }
    
        mergedList.sort(
            ( a, b ) => 
                a.distance - b.distance
        );
    
        const skip = lastItemId !== 'null' ? mergedList.findIndex( event => event._id.toString() === lastItemId ) + 1 : 0;
        const resultList = mergedList.slice( skip, skip + limit );

        return res.status( 200 ).json({
            error: false,
            message: "discover screen users and events list is prepared succesfully",
            totalDataCount: mergedList.length,
            dataList: resultList,
        });

    }catch( err ){
        console.log( "ERROR: getUsersAndEventsByLocationController - ", err );
        return res.status( 500 )
                  .json(
                        {
                            error: true,
                            message: "Internal server error"
                        }
                  );
    }
  }

  export default getUsersAndEventsByLocationController;