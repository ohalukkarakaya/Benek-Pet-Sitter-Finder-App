import User from "../../../models/User.js";
import Event from "../../../models/Event/Event.js";
import Pet from "../../../models/Pet.js";

const getUsersAndEventsBySearchValueController = async ( req, res ) => {
    try{
        const limit = req.params.limit || 10;
        const skip = req.params.skip || 0;
        const lat = req.body.lat;
        const lng = req.body.lng;
        const searchTerm = req.body.searchValue.toString();
        const userId = req.user._id.toString();
        const filter = req.body.filter;

        if(
            !lat
            || !lng
            || !searchTerm
        ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "missing params"
                }
            );
        }

        if( 
            filter
            && filter !== "user" 
            && filter !== "User"
            && filter !== "USER"
            && filter !== "event" 
            && filter !== "Event"
            && filter !== "EVENT"
        ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "wrong type of filter"
                }
            );
        }

        let userList;
        let eventList;

        if( 
            !filter
            || filter === "user" 
            || filter === "User"
            || filter === "USER"
        ){
            const users = await User.aggregate(
                [
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
                    // Kullanıcıları stars, followers, followingUsersOrPets, caregiverCareer ve pastCaregivers
                    // değerlerine göre tekrar sırala
                    {
                        $sort: {
                            "stars.star": -1,
                            followers: -1,
                            followingUsersOrPets: 1,
                            caregiverCareer: -1,
                            pastCaregivers: -1,
                        },
                    },
                    // deactivation kaydı kontrol et ve geçersiz kullanıcıları atla
                    {
                        $match: {
                            $and: [
                                {
                                    "deactivation.isDeactive": false
                                },
                                {
                                    blockedUsers: {
                                        $nin: [
                                            userId
                                        ]
                                    }
                                },
                                {
                                    $or: [
                                        {
                                            "userName": {
                                                $regex: searchTerm,
                                                $options: "i"
                                            }
                                        },
                                        {
                                            "identity.firstName": {
                                                $regex: searchTerm,
                                                $options: "i"
                                            }
                                        },
                                        {
                                            "identity.middleName": {
                                                $regex: searchTerm,
                                                $options: "i"
                                            }
                                        },
                                        {
                                            "identity.lastName": {
                                                $regex: searchTerm,
                                                $options: "i"
                                            }
                                        },
                                        {
                                            "identity.openAdress": {
                                                $regex: searchTerm,
                                                $options: "i"
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                    },
                ]
            );

            userList = users;
        }

        if(
            !filter
            || filter === "event"
            || filter === "Event"
            || filter === "EVENT"
        ){
            // prepare events
            const events = await Event.find(
                {
                    isPrivate: isPrivate === "false",
                    "adress.lat": { 
                        $exists: true 
                    },
                    "adress.long": { 
                        $exists: true 
                    },
                    date: { 
                        $gte: new Date() 
                    },
                    $or: [
                        { 
                            "adress.adressDesc": { 
                                $regex: searchTerm, 
                                $options: "i" 
                            } 
                        },
                        { 
                            desc: { 
                                $regex: searchTerm, 
                                $options: "i" 
                            } 
                        }
                    ]
                }
            ).sort(
                {
                    "adress.lat": 1,
                    "adress.long": 1,
                    date: 1,
                }
            );

            events.filter(
                ( event ) => {

                    if( event.maxGuests !== -1 ){

                        return event.maxGuests >= event.willJoin
                                                    .length;

                    }else{

                        return true

                    }
                }
            );

            const sortedEvents = events.map(
                ( event ) => {
                    const distance = Math.pow(
                                        event.adress.lat - lat, 
                                        2
                                    ) 
                                    + Math.pow(
                                        event.adress.long - lng, 
                                        2
                                    );
                    return { ...event.toObject(), distance };
                }
            ).sort(
                ( a, b ) => 
                    a.distance - b.distance
            );

            eventList = sortedEvents;
        }
        
        

        const mergedList = [...userList, ...eventList];

        mergedList.forEach(
            async ( item ) => {
                if(item instanceof User) {
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
                    
                    item.pets.forEach(
                        async ( petId ) => {
                            const pet = await Pet.findById( petId.toString() );
                            const petInfo = {
                                petId: petId.toString(),
                                petProfileImgUrl: pet.petProfileImg.imgUrl,
                                petName: pet.name
                            }
                            item.petList.push( petInfo );
                        }
                    );
                    if( item.petList.length === item.pets.length ){
                        delete item.pets;
                    }
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

                    const eventAdmin = await User.findById( item.eventAdmin.toString() );
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

                    item.eventOrganizers.forEach(
                        async( organizerId ) => {
                            const organizer = await User.finfById( organizerId.toString() );
                            const organizerInfo = {
                                userId: organizer._id.toString(),
                                userProfileImg: organizer.profileImg.imgUrl,
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
                    )

                    if( item.organizers.length === item.eventOrganizers.length ){
                        delete item.eventOrganizers
                    }

                    item.willJoin.forEach(
                        async ( joiningUserId ) => {
                            const joiningUser = await User.findById( joiningUserId );
                            const usersWhoWillJoinInfo = {
                                userId: joiningUserId,
                                userProfileImg: joiningUser.profileImg.imgUrl,
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
                            item.usersWhoWillJoin.push( usersWhoWillJoinInfo );
                        }
                    );
                    
                    if( item.usersWhoWillJoin.length === item.willJoin.length ){
                        delete item.willJoin;
                    }
                }
            }
        );

        mergedList.sort(
            ( a, b ) => 
                a.distance - b.distance
        );

        const resultList = mergedList.slice(skip, skip + limit);

        return res.status( 200 ).json(
            {
                error: false,
                message: "discover screen users and events list is prepared succesfully",
                dataList: resultList
            }
        );
    }catch( err ){
        console.log("ERROR: getUsersAndEventsBySearchValueController - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default getUsersAndEventsBySearchValueController;