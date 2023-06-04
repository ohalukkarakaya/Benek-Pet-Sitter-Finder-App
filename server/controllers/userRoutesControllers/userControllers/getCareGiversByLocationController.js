import User from "../../../models/User.js";

import { Worker } from "worker_threads";

const getCareGiversByLocationController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const lat = req.body.lat;
        const lng = req.body.lng;

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
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "Missing param"
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
                                isCareGiver: true
                            }
                        ]
                    },
                },
                { $skip: parseInt( skip ) },
                { $limit: parseInt( limit ) }
            ]
        );

        worker.postMessage(
            {
                type: "processGetCareGiversByLocation",
                payload: {
                    lat: lat,
                    lng: lng,
                    users: users
                }
            }
        );

        
    }catch( err ){
        console.log( "ERROR: getCareGiversByLocationController - ", err );
        return res.status( 500 ).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default getCareGiversByLocationController;