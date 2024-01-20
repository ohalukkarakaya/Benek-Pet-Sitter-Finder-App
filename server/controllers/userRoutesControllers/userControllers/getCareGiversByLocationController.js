import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";
import mongoose from "mongoose";

const getCareGiversByLocationController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const limit = req.params.limit || 10;
        const lastItemId = req.params.lastItemId || 'null';
        const lat = parseFloat( req.body.lat );
        const lng = parseFloat( req.body.lng );

        if( !lat || !lng ){
            return res.status( 400 ).json({
                error: true,
                message: "Missing param"
            });
        }
        
        const totalCount = await User.countDocuments( 
            {
                $and: [
                    { "_id": { $ne: mongoose.Types.ObjectId( userId ) } },
                    { "deactivation.isDeactive": false },
                    { blockedUsers: { $nin: [ userId ] } },
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
                                    { $pow: [ {$subtract: [ lat, "$location.lat" ]}, 2 ] },
                                    { $pow: [ {$subtract: [lng, "$location.lng"]}, 2 ] },
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
                            lastItemId !== 'null' ? { "_id": { $lt: mongoose.Types.ObjectId(lastItemId) } } : {},
                            { "_id": { $ne: mongoose.Types.ObjectId( userId ) } },
                            { "deactivation.isDeactive": false },
                            { blockedUsers: { $nin: [ userId ] } },
                            { isCareGiver: true }
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
            
            for( let petId of item.pets ){
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
            };

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
            totalDataCount: totalCount,
            careGiverList: users
        });
        
    }catch( err ){
        console.log( "ERROR: getCareGiversByLocationController - ", err );
        return res.status( 500 ).json({
            error: true,
            message: "Internal server error"
        });
    }
}

export default getCareGiversByLocationController;