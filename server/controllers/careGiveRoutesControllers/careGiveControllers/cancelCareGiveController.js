import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";
import CareGive from "../../../models/CareGive/CareGive.js";
import PaymentData from "../../../models/PaymentData/PaymentData.js";

import mokaVoid3dPaymentRequest from "../../../utils/mokaPosRequests/mokaPayRequests/mokaVoid3dPaymentRequest.js";
import mokaValidateHourForVoidPaymentHelper from "../../../utils/mokaPosRequests/mokaHelpers/mokaValidateHourForVoidPaymentHelper.js";
import deleteFileHelper from "../../../utils/fileHelpers/deleteFileHelper.js";

const cancelCareGiveController = async (req, res ) => {
    try{
        const careGiveId = req.params.careGiveId.toString();
        if( !careGiveId ){
            return res.status( 400 )
                      .json(
                           {
                               error: true,
                               message: "missing params"
                           }
                       );
        }

        const careGive = await CareGive.findById( careGiveId );
        if( !careGive ){
            return res.status( 404 )
                      .json(
                           {
                               error: true,
                               message: "Care give not found"
                           }
                       );
        }

        if(
            careGive.petOwner.petOwnerId.toString() !== req.user._id.toString()
            && careGive.careGiver.careGiverId.toString() !== req.user._id.toString()
        ){
            return res.status( 401 )
                      .json(
                           {
                               error: true,
                               message: "You'r unauthorized to cancel this care give"
                           }
                       );
        }

        if( 
            new Date( careGive.startDate ).getTime() <= Date.now() 
            || careGive.isStarted
            || careGive.finishProcess.isFinished
        ){
            return res.status( 400 )
                      .json(
                           {
                               error: true,
                               message: "It is too late to cancel"
                           }
                       );
        }


        const petOwner = await User.findById( careGive.petOwner.petOwnerId.toString() );
        if(
            !petOwner 
            || petOwner.deactivation.isDeactive
        ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "Pet owner not found"
                            }
                       );
        }

        const careGiver = await User.findById( careGive.careGiver.careGiverId.toString() );
        const pet = await Pet.findById( careGive.petId.toString() );

        if(
            careGive.prices.priceType !== "Free" 
            && careGive.prices.servicePrice > 0
        ){
            const paidPayments = await PaymentData.find({ parentContentId: careGive._id.toString() });
            if( 
                !paidPayments 
                || paidPayments.length <= 0
            ){
                return res.status( 500 )
                          .json(
                            {
                                error: true,
                                message: "Internal Server Error"
                            }
                          );
            }

            for(
                let payment
                of paidPayments
            ){
                const cancelPayment = await mokaVoid3dPaymentRequest( payment.virtualPosOrderId );
                if( 
                    !cancelPayment 
                    || (
                        cancelPayment.serverStatus
                        && cancelPayment.serverStatus !== 0
                        && cancelPayment.serverStatus !== 1
                        && (
                            cancelPayment.error === true 
                            || !( cancelPayment.data )
                        )
                    )
                ){
                    return res.status( 500 )
                            .json(
                                    {
                                        error: true,
                                        message: "Internal server error"
                                    }
                            );
                }
            }
        }

        petOwner.pastCaregivers = petOwner.pastCaregivers
                                          .filter(
                                            careGiverId =>
                                                careGiverId.toString() !== careGive.careGiver
                                                                                   .careGiverId
                                                                                   .toString()
                                           );

        petOwner.markModified("pastCaregivers");
        petOwner.save(
            function (err) {
                if(err) {
                    console.error('ERROR: While Update!');
                }
              }
        );

        careGiver.caregiverCareer
                 .filter(
                       careerObject =>
                            careerObject.pet
                                        .toString() !== careGive.petId
                                                                .toString()
                  );
        careGiver.markModified( "caregiverCareer" );
        careGiver.save(
            function (err) {
                if(err) {
                    console.error('ERROR: While Update!');
                }
              }
        );


        pet.careGiverHistory
           .filter(
                historyObject =>
                    historyObject.careGiver
                                .toString() !== careGive.careGiver
                                                        .careGiverId
                                                        .toString()
            );
        pet.markModified( "careGiverHistory" );
        pet.save(
              ( err ) => {
                if( err ) {
                    console.error( 'ERROR: While Update!' );
                }
              }
        );

        const deleteAssets = await deleteFileHelper( `CareGive/${ careGive._id.toString() }` );
        if( deleteAssets.error ){
            return res.status( 500 )
                      .json(
                        {
                            error: true,
                            message: "Internal Server Error"
                        }
                      );
        }
        
        careGive.deleteOne()
                .then(
                    async (_) => {
                        return res.status( 200 )
                                  .json(
                                       {
                                           error: false,
                                           message: "careGive canceled succesfully"
                                       }
                                   );
                    }
                ).catch(
                    async ( error ) => {
                        if( error ){
                            console.log( error );

                            return res.status( 500 )
                                      .json(
                                           {
                                               error: true,
                                               message: "Internal server error"
                                           }
                                       );
                        }
                    }
                );
    }catch( err ){
        console.log( "ERROR: cancel care give", err );

        return res.status( 500 )
                  .json(
                       {
                           error: true,
                           message: "Internal server error"
                       }
                   );
    }
}

export default cancelCareGiveController;