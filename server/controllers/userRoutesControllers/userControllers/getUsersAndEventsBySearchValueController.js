import User from "../../../models/User.js";
import Event from "../../../models/Event/Event.js";


import { Worker } from "worker_threads";

const getUsersAndEventsBySearchValueController = async ( req, res ) => {
    try{
        const limit = req.params.limit || 10;
        const skip = req.params.skip || 0;
        const lat = req.body.lat;
        const lng = req.body.lng;
        const searchTerm = req.body.searchValue.toString();
        const userId = req.user._id.toString();
        const filter = req.body.filter;

        const worker = new Worker( "./worker_threads/workerThreads.js" );

        // cevap döndüğünde
        worker.on(
            "message", 
            ( message ) => {
            if( 
                message.type === "success" 
            ){
              res.status( 200 )
                 .json( 
                    message.payload 
                  );
            }else if( 
                message.type === "error" 
            ){
              res.status( 400 )
                 .json( 
                    message.payload 
                 );
            }
          }
        );

        if(
            !lat
            || !lng
            || !searchTerm
        ){
            return res.status( 400 )
                      .json(
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

        worker.postMessage(
            {
                type: "processGetUsersAndEventsBySearchValue",
                payload: {
                    skip: skip,
                    limit: limit,
                    lat: lat,
                    lng: lng,
                    list: mergedList
                }
            }
        );

    }catch( err ){
        console.log( "ERROR: getUsersAndEventsBySearchValueController - ", err );
        return res.status( 500 )
                  .json(
                        {
                            error: true,
                            message: "Internal server error"
                        }
                  );
    }
}

export default getUsersAndEventsBySearchValueController;