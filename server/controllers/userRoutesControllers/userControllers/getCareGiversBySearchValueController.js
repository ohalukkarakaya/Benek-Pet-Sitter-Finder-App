import User from "../../../models/User.js";

const getCareGiversBySearchValueController = async ( req, res ) => {
    try{
        
        const userId = req.user._id.toString();
        const lat = parseFloat( req.body.lat );
        const lng = parseFloat( req.body.lng );
        const searchTerm = req.body.searchValue.toString();
        const limit = req.params.limit || 15;
        const lastItemId = req.body.lastItemId || 'null';

        if( !lat || !lng || !searchTerm ){
            return res.status( 400 ).json( {
                error: true,
                message: "Missing param"
            });
        }

        const totalCount = await User.countDocuments(
            {
                $and: [
                    { "deactivation.isDeactive": false },
                    { blockedUsers: { $nin: [ userId ] } },
                    {
                        $or: [
                            { "userName": { $regex: searchTerm, $options: "i" } },
                            { "identity.firstName": { $regex: searchTerm, $options: "i" } },
                            { "identity.middleName": { $regex: searchTerm, $options: "i" } },
                            {  "identity.lastName": { $regex: searchTerm, $options: "i" } },
                            { "identity.openAdress": { $regex: searchTerm, $options: "i" } }
                        ]
                    },
                    { isCareGiver: true }
                ]
            }
        );

        const users = await User.aggregate(
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
                                        {$subtract: [ lat, "$location.lat" ]}, 
                                        2 
                                    ] 
                                },
                                {
                                    $pow: [ 
                                        { $subtract: [ lng, "$location.lng" ] },
                                        2 
                                    ] 
                                },
                                ],
                            },
                        },
                    },
                },
                // En yakın kullanıcılara öncelik ver
                {$sort: { distance: 1 }},

                // deactivation kaydı kontrol et ve geçersiz kullanıcıları atla
                {
                    $match: {
                        $and: [
                            {"deactivation.isDeactive": false},
                            {blockedUsers: { $nin: [ userId ] }},
                            {
                                $or: [
                                    {"userName": { $regex: searchTerm, $options: "i" }},
                                    {"identity.firstName": { $regex: searchTerm, $options: "i"}},
                                    {"identity.middleName": { $regex: searchTerm, $options: "i" }},
                                    {"identity.lastName": { $regex: searchTerm, $options: "i" }},
                                    {"identity.openAdress": { $regex: searchTerm, $options: "i" }}
                                ]
                            },
                            {isCareGiver: true},
                            { "_id": { $lt: lastItemId } }
                        ]
                    },
                },
                { $limit: parseInt( limit ) }
            ]
        );

        for( let item of users ){
            const { location } = item;
            const distance = Math.sqrt( Math.pow( location.lat - lat, 2 ) + Math.pow( location.lng - lng, 2 ) );
            item.distance = distance;
    
            for( var petId of item.pets ){
                const pet = await Pet.findById( petId.toString() );
                const petInfo = {
                    petId: petId.toString(),
                    isDefaultImg: pet.petProfileImg.isDefaultImg,
                    petProfileImgUrl: pet.petProfileImg.imgUrl,
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
    
            for( let dependedId of item.dependedUsers ){
                const depended = await User.findById( dependedId );
                const dependedInfo = getLightWeightUserInfoHelper( depended );
                
                dependedId = dependedInfo;
            }
    
            const starValues = item.stars.map( starObject => starObject.star );
    
            const totalStarValue = starValues.reduce( ( acc, curr ) => acc + curr, 0 );
    
            const starCount = item.stars.length;
            const starAvarage = totalStarValue / starCount;
    
            item.totalStar = starCount;
            item.stars = starAvarage;
        }

        return res.status( 200 ).json({
            error: false,
            message: "careGiver list prepared succesfully",
            totalCount: totalCount,
            careGiverList: users
        });

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

export default getCareGiversBySearchValueController;