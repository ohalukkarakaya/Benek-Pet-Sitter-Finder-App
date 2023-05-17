import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";
import CareGive from "../../../models/CareGive/CareGive.js";

const cancelCareGiveController = async (req, res ) => {
    try{
        const careGiveId = req.params
                              .careGiveId
                              .toString();
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
            careGive.petOwner
                    .petOwnerId
                    .toString() !== req.user
                                       ._id
                                       .toString()

            && careGive.careGiver
                       .careGiverId
                       .toString() !== req.user
                                          ._id
                                          .toString()
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
            Date.parse( 
                    careGive.startDate 
                ) <= Date.now()
        ){
            return res.status( 400 )
                      .json(
                           {
                               error: true,
                               message: "It is too late to cancel"
                           }
                       );
        }

        const petOwner = await User.findById( 
                                        careGive.petOwner
                                                .petOwnerId
                                                .toString() 
                                    );

        if(
            !petOwner 
            || petOwner.deactivation
                       .isDeactive
        ){
            return res.status(404).json(
                {
                    error: true,
                    message: "Pet owner not found"
                }
            );
        }

        const careGiver = await User.findById( 
                                            careGive.careGiver
                                                    .careGiverId
                                                    .toString() 
                                     );
        if(
            !careGiver 
            || careGiver.deactivation
                        .isDeactive
        ){
            return res.status( 404 )
                      .json(
                           {
                               error: true,
                               message: "Care Giver not found"
                           }
                       );
        }

        const pet = await Pet.findById( 
                                    careGive.petId
                                            .toString() 
                              );
        if( !pet ){
            return res.status( 404 )
                      .json(
                           {
                               error: true,
                               message: "Pet not found"
                           }
                       );
        }

        if(
            careGive.prices
                    .priceType !== "Free" 
            && careGive.prices
                       .servicePrice > 0
        ){
            if( 
                petOwner.refundCredit.priceType !== careGive.prices.priceType
                && petOwner.refundCredit.priceType !== "None"
            ){
                return res.status(400).json(
                    {
                        error: true,
                        message: "money type doesn't fit"
                    }
                );
            }

            if( 
                petOwner.refundCredit
                        .priceType === "None" 
            ){
                petOwner.refundCredit
                        .priceType = careGive.prices
                                             .priceType
            }

            petOwner.refundCredit
                    .credit = petOwner.refundCredit
                                      .credit + careGive.prices
                                                        .servicePrice;
            petOwner.markModified("refundCredit");
        }

        petOwner.pastCaregivers = petOwner.pastCaregivers
                                          .filter(
                                            careGiverId =>
                                                careGiverId.toString() !== careGive.careGiver
                                                                                   .careGiverId
                                                                                   .toString()
                                           );
        petOwner.markModified("refundCredit");
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
        careGiver.markModified("caregiverCareer");
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