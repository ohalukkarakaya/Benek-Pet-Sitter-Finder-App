import CareGive from "../../../../models/CareGive/CareGive.js";
import dotenv from "dotenv";

dotenv.config();

const scheduleMissionController = async (req, res) => {
    try{
        const careGiveId = req.params.careGiveId.toString();
        const missionDesc = req.body.missionDesc.toString();
        const missionDate = Date.parse(req.body.missionDate.toString());

        if(!careGiveId || !missionDesc || !missionDate){
            return res.status(400).json(
                {
                    error: true,
                    message: "Missing param"
                }    
            );
        }
        
        const careGive = await CareGive.findById(careGiveId);
        if(!careGive){
            return res.status(404).json(
                {
                    error: true,
                    message: "Care give not found"
                }
            );
        }
        const isVolunteer = careGive.prices.priceType === "Free";
        if(isVolunteer){
            return res.status(401).json(
                {
                    error: true,
                    message: "You can't schedule mission for Free careGive"
                }
            );
        }

        if( Date.parse(careGive.endDate) < missionDate ){
            return res.status(400).json(
                {
                    error: true,
                    message: "You can't insert mission on this date"
                }
            );
        }

        const areThereMissionAtSameTime = careGive.missionCallender.find(
            missionObject => 
                missionObject.missionDate === missionDate
        );
        if(areThereMissionAtSameTime){
            return res.status(400).json(
                {
                    error: true,
                    message: "there is allready mission scheduled at this time"
                }
            );
        }

        const isExtraMission = careGive.missionCallender.length >= careGive.prices.maxMissionCount;
        if(isExtraMission){
            careGive.prices.maxMissionCount = careGive.prices.maxMissionCount + 1;
            careGive.prices.boughtExtra = careGive.prices.boughtExtra + 1;
            careGive.markModified("prices");
            //take payment
        }

        careGive.missionCallender.push(
            {
                missionDesc: missionDesc,
                missionDate: missionDate,
                missionDeadline: new Date.parse(missionDate + 1*60*60*1000),
                isExtra: isExtraMission
            }
        );
        careGive.markModified("missionCallender");
        careGive.save().then(
            (savedMission) => {
                if(savedMission){
                    return res.status(200).json(
                        {
                            error: false,
                            message: "mission inserted succesfully",
                            missionId :savedMission._id.toString()
                        }
                    );
                }
            }
        ).catch(
            (error) => {
                if(error){
                    console.log(error);
                    return res.status(500).json(
                        {
                            error: true,
                            message: "Internal server error"
                        }
                    );
                }
            }
        );
    }catch(err){
        console.log("Error: schedule care give mission - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default scheduleMissionController;