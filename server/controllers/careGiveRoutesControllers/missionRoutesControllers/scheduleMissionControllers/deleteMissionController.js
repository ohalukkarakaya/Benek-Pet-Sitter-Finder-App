import CareGive from "../../../../models/CareGive/CareGive.js";

import dotenv from "dotenv";

dotenv.config();

const deleteMissionController = async (req, res) => {
    try{
        const userId = req.user._id.toString();
        const careGiveId = req.params.careGiveId;
        const missionId = req.params.missionId;
        if( !userId || !careGiveId || !missionId ){
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
        if(careGive.petOwner.petOwnerId.toString() !== userId.toString()){
            return res.status(401).json(
                {
                    error: true,
                    message: "you are not authorized to delete this mission"
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

        careGive.missionCallender = careGive.missionCallender.filter(
            missionObject => 
                missionObject._id.toString() !== missionId.toString()
        );
        careGive.markModified("missionCallender");
        careGive.save().then(
            (_) => {
                return res.status(200).json(
                    {
                        error: false,
                        message: "mission deleted succesfully"
                    }
                );
            }
        ).catch(
            (error) => {
                if(error){
                    console.log(error);
                    return res.status(500).json(
                        {
                            error: true,
                            message: "Internal Server Error"
                        }
                    );
                }
            }
        );
    }catch(err){
        console.log("Error: accept extra service mission - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default deleteMissionController;