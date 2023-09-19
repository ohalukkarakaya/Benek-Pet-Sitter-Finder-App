import CareGive from "../../../../models/CareGive/CareGive.js";

import crypto from "crypto";

const getTimeCodeForUploadMissionController = async (req, res) => {
    try{
        const careGiveId = req.params.careGiveId;
        const missionId = req.params.missionId;
        const userId = req.user._id.toString();

        if(
            !careGiveId 
            || !missionId 
            || !userId
        ){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "missing params"
                            }
                       );
        }

        const careGive = await CareGive.findById( careGiveId.toString() );
        if( !careGive ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "Care give not found"
                            }
                       );
        }

        if( careGive.careGiver.careGiverId.toString() !== userId ){
            return res.status( 401 )
                      .json(
                            {
                                error: true,
                                message: "You are not authorized to upload this mission"
                            }
                       );
        }

        const mission = careGive.missionCallender.find(
            missionObject =>
                missionObject._id.toString() !== missionId.toString()
        );
        if( !mission ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "mission not found"
                            }
                       );
        }

        if(
            !mission.missionAcception.isAccepted
            || ( 
                mission.extra.isExtra 
                && !mission.extra.isExtraAccepted 
            )
        ){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "mission not accepted yet"
                            }
                       );
        }

        let password = crypto.randomBytes( 3 )
                             .toString( 'hex' )
                             .toUpperCase();

        if(password !== ""){
            mission.missionContent.timeSignature.timePassword = password;
            mission.missionContent.timeSignature.expiresAt = Date.now() + 10 * 60 * 1000;

            careGive.markModified("missionCallender");
            careGive.save().then(
                (_) => {
                    return res.status(200).json(
                        {
                            error: false,
                            message: "password created succesfully, it will expires in 10 min",
                            timeSignature: password
                        }
                    );
                }
            ).catch(
                (error) => {
                    console.log(err);
                    return res.status(500).json(
                        {
                            error: true,
                            message: "Internal Server Error"
                        }
                    );
                }
            );
        }
    }catch(err){
        console.log(err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default getTimeCodeForUploadMissionController;