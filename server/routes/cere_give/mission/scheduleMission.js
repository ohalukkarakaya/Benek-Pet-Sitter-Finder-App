import express from "express";
import CareGive from "../../models/CareGive/CareGive.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import auth from "../../middleware/auth.js";

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

            careGive.missionCallender.push(
                {
                    missionDesc: missionDesc,
                    missionDate: missionDate,
                    missionDeadline: new Date.parse(missionDate + 1*60*60*1000),

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

//accept mission
router.put(
    "/acception/:careGiveId/:missionId/:response",
    auth,
    async (req, res) => {
        try{
            const userId = req.user._id.toString();
            const careGiveId = req.params.careGiveId;
            const missionId = req.params.missionId;
            const responseAsString = req.params.response;
            const extraPrice = req.body.extraServicePrice;
            const reasonToMakeExtra = req.body.reasonToMakeExtra
            let isExtra;

            if(!userId || !careGiveId || !missionId || !responseAsString){
                return res.status(400).json(
                    {
                        error: true,
                        message: "Missing params"
                    }
                );
            }

            if(responseAsString !== "true" && responseAsString!== "false"){
                return res.status(400).json(
                    {
                        error: true,
                        message: "response type can be boolean"
                    }
                );
            }

            if(
                reasonToMakeExtra && !extraPrice
                || !reasonToMakeExtra && extraPrice
                || extraPrice && !extraPrice.priceType
                || extraPrice && extraPrice.priceType && extraPrice.priceType !== "TL"
                || extraPrice && extraPrice.priceType && extraPrice.priceType !== "USD"
                || extraPrice && extraPrice.priceType && extraPrice.priceType !== "EUR"
                || extraPrice && !extraPrice.price
                || extraPrice && extraPrice.price && typeof extraPrice.price !== "number"
            ){
                return res.status(400).json(
                    {
                        error: true,
                        message: "invalid price value"
                    }
                );
            }

            const response = responseAsString === "true";

            if(extraPrice && response){
                isExtra = true;
            }else{
                isExtra = false;
            }

            const careGive = await CareGive.findById(careGiveId.toString());
            if(!careGive){
                return res.status(404).json(
                    {
                        error: true,
                        message: "care give not found"
                    }
                );
            }

            if(careGive.careGiver.careGiverId.toString !== userId){
                return res.status(401).json(
                    {
                        error: true,
                        message: "you can not accept this care give"
                    }
                );
            }

            const mission = careGive.missionCallender.find(
                missionObject =>
                    missionObject._id.toString() === missionId.toString()
            );
            if(!mission){
                return res.status(400).json(
                    {
                        error: true,
                        message: "Mission not found"
                    }
                );
            }

            if(Date.parse(mission.startDate) <= Date.now()){
                careGive.missionCallender = careGive.missionCallender.filter(
                    missionObject =>
                        missionObject._id.toString() !== missionId.toString()
                );
                careGive.markModified("missionCallender");
                careGive.save().then(
                    (_) => {
                        return res.status(400).json(
                            {
                                error: true,
                                message: "it is too late to accept so mission expired"
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
            }

            if(!response){
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
                                message: "mission refuse succesfully"
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
            }else if(response && !isExtra){
                mission.missionAcception.isAccepted = true;
                careGive.markModified("missionCallender");
                careGive.save().then(
                    (_) => {
                        return res.status(200).json(
                            {
                                error: false,
                                message: "mission accepted succesfully"
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
            }else if(response && isExtra){
                mission.missionAcception.isAccepted = true;
                mission.missionAcception.ReasonToMakeExtra = reasonToMakeExtra;
                mission.extra.isExtra = true;
                mission.extra.extraServicePrice.priceType = extraPrice.priceType;
                mission.extra.extraServicePrice.price = extraPrice.price;
                
                careGive.markModified("missionCallender");
                careGive.save().then(
                    (_) => {
                        return res.status(200).json(
                            {
                                error: false,
                                message: "mission marked as extra service succesfully"
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
            }



        }catch(err){
            console.log("Error: accept care give mission - ", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);

//accept missions extra service request
router.put(
    "/mission/extraAcception/:careGiveId/:missionId/:response",
    auth,
    async (req, res) => {
        try{
            const userId = req.user._id.toString();
            const careGiveId = req.params.careGiveId;
            const missionId = req.params.missionId;
            const responseAsString = req.params.response;
            if( !userId || !careGiveId || !missionId || !responseAsString ){
                return res.status(400).json(
                    {
                        error: true,
                        message: "missing params"
                    }
                );
            }

            if(responseAsString !== "true" && responseAsString!== "false"){
                return res.status(400).json(
                    {
                        error: true,
                        message: "response type can be boolean"
                    }
                );
            }

            const response = responseAsString === "true";

            const careGive = await CareGive.findById(careGiveId.toString());
            if(!careGive){
                return res.status(404).json(
                    {
                        error: true,
                        message: "careGive not found"
                    }
                );
            }
            if(careGive.petOwner.petOwnerId.toString !== userId.toString()){
                return res.status(401).json(
                    {
                        error: true,
                        message: "you are not authorized to accept this request"
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
            if(
                !mission.missionAcception.isMissionAccepted
                || !mission.extra.isExtra
                || mission.extra.isExtraAccepted
                || mission.extra.extraServicePrice.priceType === "NotExtra"
                    && mission.extra.extraServicePrice.price === 0
            ){
                return res.status(400).json(
                    {
                        error: true,
                        message: "something wrong with your request"
                    }
                );
            }

            if(!response){
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
                                message: "mission refused succesfully"
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
            }else{
                const price = mission.extra.extraServicePrice.price;
                const priceType = mission.extra.extraServicePrice.priceType;
                // take payment here

                mission.isExtraAccepted = true;
                careGive.markModified("missionCallender");
                careGive.save().then(
                    (_) => {
                        return res.status(200).json(
                            {
                                error: false,
                                message: "extra service accepted succesfully"
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
            }


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