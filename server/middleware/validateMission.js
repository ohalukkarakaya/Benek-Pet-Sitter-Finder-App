import CareGive from "../models/CareGive/CareGive.js";

const validateMission = async (req, res, next) => {
    try{
        const careGiveId = req.params.careGiveId;
        const missionId = req.params.missionId;
        const timeSignaturePassword = req.header.timeSignaturePassword;
        const userId = req.user._id.toString();

        if( !careGiveId || !missionId || !timeSignaturePassword || !userId ){
            return res.status(400).json(
                {
                    error: true,
                    message: "missing params"
                }
            );
        }

        const careGive = await CareGive.findById(careGiveId.toString());
        if(!careGive){
            return res.status(404).json(
                {
                    error: true,
                    message: "careGive not found"
                }
            );
        }
        if(careGive.careGiver.careGiverId.toString !== userId){
            return res.status(401).json(
                {
                    error: true,
                    message: "You are not authorized to upload content in this mission"
                }
            );
        }

        const mission = careGive.missionCallender.find(
            missionObject =>
                missionObject._id.toString() === missionId.toString()
        );
        if(!mission){
            return res.status(404).json(
                {
                    error: true,
                    message: "mission not found"
                }
            );
        }
        if(mission.missionContent.timeSignature.timePassword !== timeSignaturePassword){
            return res.status(400).json(
                {
                    error: true,
                    message: "invalid time signature password"
                }
            );
        }
        if(Date.parse(mission.missionContent.timeSignature.expiresAt) < Date.now()){
            return res.status(400).json(
                {
                    error: true,
                    message: "invalid time signature password"
                }
            );
        }
        req.missionId = mission._id.toString();
        req.careGiveId = careGive._id.toString();
        req.careGive = careGive;
        req.mission = mission;
        next();
    }catch(err){
        console.log(err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
};

export default validateMission;