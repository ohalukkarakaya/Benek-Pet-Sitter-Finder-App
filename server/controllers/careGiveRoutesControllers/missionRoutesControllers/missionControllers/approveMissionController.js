import dotenv from "dotenv";

dotenv.config();

const approveMissionController = async (req, res) => {
    try{
        const careGiveId = req.params.careGiveId;
        const missionId = req.params.missionId;

        if(!careGiveId || !missionId){
            return res.status(500).json(
                {
                    error: true,
                    message: "Missing params"
                }
            );
        }

        const careGive = await careGive.findById(careGiveId.toString());
        if(!careGive){
            return res.status(404).json(
                {
                    error: true,
                    message: "CareGive not found"
                }
            );
        }
        if(careGive.petOwner.petOwnerId.toString() !== req.user._id.toString()){
            return res.status(401).json(
                {
                    error: true,
                    message: "You are not authorized to approve this mission"
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
                    message: "Mission not found"
                }
            );
        }
        if(!mission.missionContent.videoUrl){
            return res.status(400).json(
                {
                    error: true,
                    message: "mission content not uploaded"
                }
            );
        }

        mission.missionContent.isApproved = true;
        careGive.markModified("missionCallender");
        careGive.save().then(
            (_) => {
                return res.status(200).json(
                    {
                        error: false,
                        message: "mission approved succesfully"
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
                            message: "Internal server error"
                        }
                    );
                }
            }
        );
    }catch(err){
        console.log(err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default approveMissionController;