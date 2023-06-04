import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";

import getLightWeightUserInfoHelper from "../../../utils/getLightWeightUserInfoHelper.js";

import { parentPort } from "worker_threads";

const getCareGiversByLocationWorker = async ( message ) => {
    try{
        const lat = message.payload.lat;
        const lng = message.payload.lng;
        const users = message.payload.users;

        for(
            let item
            of users
        ){
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

            for(
                let dependedId
                of item.dependedUsers
            ){
                const depended = await User.findById( dependedId );
                const dependedInfo = getLightWeightUserInfoHelper( depended );
                
                dependedId = dependedInfo;
            };

            const starValues = item.stars
                                   .map( 
                                        starObject => 
                                                starObject.star 
                                    );
            const totalStarValue = starValues.reduce(
                                                ( acc, curr ) =>
                                                            acc + curr, 0
                                              );
            const starCount = item.stasr.length;
            const starAvarage = totalStarValue / starCount;

            item.totalStar = starCount;
            item.stars = starAvarage;
        }

        parentPort.postMessage(
            {
                type: "success",
                payload: {
                    error: false,
                    message: "careGiver list prepared succesfully",
                    careGiverList: users
                }
            }
       );
       
    }catch( err ){
        console.log( "ERRROR: getCareGiversByLocationWorker - ", err );
    }
}

export default getCareGiversByLocationWorker;