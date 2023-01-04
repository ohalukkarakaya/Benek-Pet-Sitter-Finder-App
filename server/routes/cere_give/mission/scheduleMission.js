import express from "express";
import CareGive from "../../../models/CareGive/CareGive.js";
import dotenv from "dotenv";
import auth from "../../../middleware/auth.js";

dotenv.config();

const router = express.Router();

//schedule mission
router.put(
    "/:careGiveId",
    auth,
    async (req, res) => {
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
);

//delete mission
router.delete(
    "/mission/delete/:careGiveId/:missionId",
    auth,
    async (req, res) => {
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
);

export default router;