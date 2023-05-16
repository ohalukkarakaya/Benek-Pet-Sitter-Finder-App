import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";
import getLightWeightUserInfoHelper from "../../../utils/getLightWeightUserInfoHelper.js";

const getCareGiversByLocationController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const lat = req.body.lat;
        const lng = req.body.lng;

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

        users.forEach(
            async ( item ) => {
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
                            petId = petInfo;
                        }
                    );
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
                    
                    item.dependedUsers.forEach(
                        async ( dependedId ) => {
                            const depended = await User.findById( dependedId );
                            const dependedInfo = getLightWeightUserInfoHelper( depended );
                            
                            dependedId = dependedInfo;
                        }
                    );

                    const starValues = item.stars.map( starObject => starObject.star );
                    const totalStarValue = starValues.reduce(
                        ( acc, curr ) =>
                                acc + curr, 0
                    );
                    const starCount = item.stasr.length;
                    const starAvarage = totalStarValue / starCount;

                    item.totalStar = starCount;
                    item.stars = starAvarage;
            }
        );

        return res.status( 200 ).json(
            {
                error: false,
                message: "careGiver list prepared succesfully",
                careGiverList: users
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