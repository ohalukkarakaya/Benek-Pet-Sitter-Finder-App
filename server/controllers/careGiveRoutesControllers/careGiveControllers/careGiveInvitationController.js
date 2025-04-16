import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";
import CareGive from "../../../models/CareGive/CareGive.js";

import dotenv from "dotenv";
import { createRequire } from "module";

import sendNotification from "../../../utils/notification/sendNotification.js";
import BanUserASAPRecord from "../../../models/Report/BanUserASAPRecord.js";

const require = createRequire(import.meta.url);
const rawPricingDataset = require('../../../src/care_give_pricing.json');
const pricingDataset = JSON.parse( JSON.stringify( rawPricingDataset ) );

dotenv.config();

const careGiveInvitationController = async ( req, res ) => {
    try{
        const petId = req.body.petId;
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        const meetingAdress = req.body.meetingAdress;

        const price = req.body.price;
        if(
            !petId
            || !startDate
            || !meetingAdress
        ){
            return res.status( 400 )
                      .json(
                          {
                            error: true,
                            message: "missing params"
                          }
                       );
        }

        let pricingToSave;
        let miliSecToCountEndDate;

        if( price ){
            if(
                !price.petTypeCode 
                || !price.serviceTypeCode 
                || !price.type
            ){
                return res.status( 400 ).json({
                    error: true,
                    message: "missing params"
                });
            }
            const petTypePricingModel = pricingDataset.prices.find(
                pricingObject =>
                    pricingObject.id === price.petTypeCode
            );
            if( !petTypePricingModel ){
                return res.status( 404 ).json({
                    error: true,
                    message: "pricing pet type model not found"
                });
            }

            const pricing = petTypePricingModel.servicePackages.find(
                petTypeObject =>
                    petTypeObject.id === price.serviceTypeCode
            );
            if( !pricing ){
                return res.status(404).json({
                    error: true,
                    message: "pricing not found"
                });
            }

            const pricingType = price.type;
            const servicePrice = pricing.priceData.servicePrice[ price.type ];
            const extraMissionPrice = petTypePricingModel.extraMission[ pricingType ];
            const maxMissionCount = pricing.priceData.numberOfTasks;

            miliSecToCountEndDate = eval( pricing.priceData.milisecondsToAdd );

            pricingToSave = {
                "priceType": pricingType,
                "servicePrice": servicePrice,
                "extraMissionPrice": extraMissionPrice,
                "maxMissionCount": maxMissionCount
            };
        }

        const pet = await Pet.findById( petId );
        if( !pet ){
            return res.status( 404 ).json({
                error: true,
                message: "Pet not found"
            });
        }

        if( pet.primaryOwner.toString() === req.user._id.toString() ){
            return res.status( 400 ).json({
                error: true,
                message: "Pet belongs to you"
            });
        }

        const isPetAlreadyInCareGive = await CareGive.findOne({
            petId: pet._id.toString(),
            endDate: { $gt: new Date() },
            'finishProcess.isFinished': false
        });

        if( isPetAlreadyInCareGive ){
            return res.status( 403 ).json({
                error: true,
                message: "pet is already with a care giver currently"
            });
        }

        if(
            Date.parse( startDate ) < Date.now() 
            || Date.parse( endDate ) < Date.parse( startDate )
        ){
            return res.status( 400 ).json({
                error: true,
                message: "invalid start or end date"
            });
        }

        const careGiver = await User.findById( req.user._id.toString() );
        const owner = await User.findById( pet.primaryOwner.toString() );

        const isCareGiverBanned = await BanUserASAPRecord.findOne({ userId: careGiver._id.toString() });
        const isOwnerBanned = await BanUserASAPRecord.findOne({ userId: owner._id.toString() });

        if( isCareGiverBanned || isOwnerBanned ){
            return res.status( 403 ).json({
                error: true,
                message: "user is banned"
            });
        }

        if(
            !owner
            || !careGiver
            || owner.deactivation.isDeactive 
            || careGiver.deactivation.isDeactive
            || careGiver.blockedUsers.includes( owner._id.toString() )
            || owner.blockedUsers.includes( careGiver._id.toString() )
        ){
            return res.status( 404 ).json({
                error: true,
                messsage: "user not found"
            });
        }
        const isOwnerVerified = owner.email;
        const isCareGiverVerified = careGiver.isCareGiver 
                                    && careGiver.email 
                                    && careGiver.phone 
                                    && careGiver.iban
                                    && careGiver.careGiveGUID;

        if( !isCareGiverVerified ){
            return res.status( 403 ).json({
                error: true,
                message: "you need to verify your phone number, email and bank accounts iban number"
            });
        }else{
            const parcalanmisBitisTarih = endDate.split('.');
            const jsBitisTarih = new Date(
                parseInt( parcalanmisBitisTarih[ 2 ] ), // Yıl
                parseInt( parcalanmisBitisTarih[ 1 ] ) - 1, // Ay (0-11 arası)
                parseInt( parcalanmisBitisTarih[ 0 ] ) // Gün
            );
            const jsEndDate = new Date( jsBitisTarih );

            const parcalanmisBaslangicTarih = startDate.split('.');
            const jsTarih = new Date(
                parseInt( parcalanmisBaslangicTarih[ 2 ] ), // Yıl
                parseInt( parcalanmisBaslangicTarih[ 1 ] ) - 1, // Ay (0-11 arası)
                parseInt( parcalanmisBaslangicTarih[ 0 ] ) // Gün
            );
            const jsStartDate = new Date( jsTarih );

            if (jsStartDate < new Date()) {
                return res.status(400).json({
                    error: true,
                    message: "start date cannot be in the past"
                });
            }

            let endDateToSave;
            if( miliSecToCountEndDate ){
                endDateToSave = new Date( jsStartDate.getTime() + miliSecToCountEndDate );
            }else{
                endDateToSave = jsEndDate
            }
            

            await new CareGive({
                    invitation: {
                        from: req.user._id.toString(),
                        to: owner._id.toString(),
                        careGiverPosGuid: careGiver.careGiveGUID.toString()
                    },
                    petId: pet._id.toString(),
                    careGiver: {
                        careGiverId: req.user._id.toString(),
                        careGiverContact: {
                                            careGiverPhone: req.user.phone,
                                            careGiverEmail: req.user.email
                                          }
                    },
                    petOwner: {
                        petOwnerId: owner._id.toString(),
                        petOwnerContact: {
                                            petOwnerEmail: owner.email,
                                            petOwnerPhone: owner.phone
                                         }
                    },
                    prices: pricingToSave,
                    startDate: jsStartDate,
                    endDate: endDateToSave,
                    adress: {
                        "adressDesc": meetingAdress.adressDesc,
                        "long": meetingAdress.lng,
                        "lat": meetingAdress.lat
                    }
                }
            ).save()
             .then(
                async ( careGiveInvitation ) => {
                    await sendNotification(
                        req.user._id.toString(),
                        owner._id.toString(),
                        "careGiveInvitation",
                        careGiveInvitation._id.toString(),
                        null, null, null, null, null, null
                    );

                    return res.status( 200 ).json({
                        error: false,
                        message: `user with the id "${ owner._id.toString() }" invented to careGive`
                    });
                }
            ).catch(
                ( error ) => {
                    if( error ){
                        console.log("Error: while creating CareGiveObject - ", error);
                        return res.status( 500 ).json({
                            error: true,
                            message: "Internal server error"
                        });
                    }
                }
            );
        }
    }catch( err ){
        console.log( "Error: care give", err );
        return res.status( 500 ).json({
            error: true,
            message: "Internal server error"
        });
    }
}

export default careGiveInvitationController;