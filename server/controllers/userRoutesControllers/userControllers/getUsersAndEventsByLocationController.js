import User from "../../../models/User.js";
import Event from "../../../models/Event/Event.js";

import { Worker } from "worker_threads";

const getUsersAndEventsByLocationController = async ( req, res) => {
    try{
        const lat = req.body.lat;
        const lng = req.body.lng;
        const limit = req.params.limit || 10;
        const skip = req.params.skip || 0;
        const userId = req.user._id.toString();

        const worker = new Worker( "./worker_threads/workerThreads.js" );

        // cevap döndüğünde
        worker.on(
            "message", 
            ( message ) => {
            if( 
                message.type === "success" 
            ){
              return res.status( 200 )
                        .json( 
                            message.payload 
                        );
            }else if( 
                message.type === "error" 
            ){
              return res.status( 400 )
                        .json( 
                            message.payload 
                        );
            }
          }
        );

        if(
            !lat
            || !lng
        ){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "missing params"
                            }
                      );
        }
    
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
                    "deactivation.isDeactive": false,
                    blockedUsers: { 
                        $nin: [
                            userId
                        ] 
                    },
                },
                },
            ]
        );
        
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
                }
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

        const mergedList = [...users, ...sortedEvents];

        worker.postMessage(
            {
                type: "processGetUsersAndEventsByLocation",
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