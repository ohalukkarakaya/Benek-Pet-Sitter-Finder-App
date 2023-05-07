import User from "../../../models/User.js";
import CareGive from "../../../models/CareGive/CareGive.js";
import dotenv from "dotenv";

dotenv.config();

const giveStarToCareGiverController = async (req, res) => {
    try{
        const careGiveId = req.params
                              .careGiveId;

        const star = req.params
                        .star;

        if(
            !careGiveId
            || !star
            || typeof star !== "number"
        ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "Some thing wrong with params"
                }
            );
        }

        const careGive = await CareGive.findById( careGiveId.toString() );
        if( !careGive ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "CareGive not found"
                }
            );
        }

        if(
            careGive.petOwner
                    .petOwnerId !== req.user
                                       ._id
                                       .toString()
        ){
            return res.status( 401 ).json(
                {
                    error: true,
                    message: "You are not authorized to give star for this pet owner"
                }
            );
        }

        if(
            !careGive.finishProcess
                     .isFinished
        ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "too early to give star"
                }
            );
        }

        const careGiverId = careGive.careGiver
                                    .careGiverId
                                    .toString();

        const careGiver = await User.findById( careGiverId );
        if(
            !careGiver 

            || careGiver.deactivation
                        .isDeactive

            || careGiver.blockedUsers.includes( 
                                            req.user
                                               ._id
                                               .toString() 
                                      )
        ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "care giver not found"
                }
            );
        }

        careGiver.stars.push(
            {
                ownerId: req.user
                            ._id
                            .toString(),

                petId: careGive.petId,

                star: star,

                date: Date.now()
            }
        );
        careGiver.markModified( "stars" );
        careGiver.save().then(
            (_) => {
                return res.status( 200 ).json(
                    {
                        error: false,
                        message: `${star} star given to care giver`
                    }
                );
            }
        ).catch(
            ( error ) => {
                if( error ){
                    console.log( error );
                    return res.status( 500 ).json(
                        {
                            error: true,
                            message: "Internal server error"
                        }
                    );
                }
            }
        );
    }catch( err ){
        console.log( "ERROR: give star", err );
        return res.status( 500 ).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default giveStarToCareGiverController;