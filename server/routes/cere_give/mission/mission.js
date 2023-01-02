import express from "express";
import CareGive from "../../../models/CareGive/CareGive.js";
import ReportMission from "../../../models/report/ReportMission.js";
import dotenv from "dotenv";
import scheduleMissionEndPoints from "./scheduleMission.js"
import auth from "../../../middleware/auth.js";
import validateMission from "../../../middleware/validateMission.js";
import { uploadMissionContent } from "../../../middleware/contentHandle/serverHandleMissionContent.js";

dotenv.config();

const router = express.Router();

//get time code for upload mission
router.put(
    "/timeSignatureCode/:careGiveId/:missionId",
    auth,
    async (req, res) => {
        try{
            const careGiveId = req.params.careGiveId;
            const missionId = req.params.missionId;
            const userId = req.user._id.toString();

            if(!careGiveId || !missionId || !userId){
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
                        message: "Care give not found"
                    }
                );
            }

            if(careGive.careGiver.careGiverId.toString() !== userId){
                return res.status(401).json(
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
            if(!mission){
                return res.status(404).json(
                    {
                        error: true,
                        message: "mission not found"
                    }
                );
            }

            if(
                !mission.missionAcception.isAccepted
                || mission.extra.isExtra && !mission.extra.isExtraAccepted
            ){
                return res.status(400).json(
                    {
                        error: true,
                        message: "mission not accepted yet"
                    }
                );
            }

            const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
            let password = "";
            for (let i = 0; i < 6; i++) {
                password += characters[Math.floor(Math.random() * characters.length)];
            }

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
);

//upload mission
router.post(
    "/:careGiveId/:missionId",
    auth,
    validateMission,
    uploadMissionContent,
    async (req, res) => {
        try{
            const careGive = req.careGive;
            const mission = req. mission;
            const cdnUrl = req.cdnUrl;
            const fileName = req.missionContent;
            
            if(!careGive || !mission || !cdnUrl || !fileName){
                return res.status(500).json(
                    {
                        error: true,
                        message: "Internal server error"
                    }
                );
            }

            mission.missionContent.videoUrl = cdnUrl;
            careGive.markModified("missionCallender");
            careGive.save().then(
                (_) => {
                    return res.status(200).json(
                        {
                            error: false,
                            message: "Mission Content Uploaded",
                            videoUrl: cdnUrl
                        }
                    );
                }
            ).catch(
                (err) => {
                    if(err){
                        console.log(err);
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
                    message: "Internal Server Error"
                }
            );
        }
    }
);

//approve mission
router.put(
    "/:careGiveId/:missionId",
    auth,
    async (req, res) => {
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
);

//report mission
router.put(
    "/report/:careGiveId/:missionId",
    auth,
    async (req, res) => {
        try{
            const careGiveId = req.params.careGiveId.toString();
            const missionId = req.params.missionId.toString();
            const reportDesc = req.body.reportDesc;

            if(!careGiveId || !missionId || !reportDesc){
                return res.status(400).json(
                    {
                        error: true,
                        message: "Missing params"
                    }
                );
            }

            const careGive = await CareGive.findById(careGiveId);
            if(!careGive){
                return res.status(404).json(
                    {
                        error: true,
                        message: "Care Give not found"
                    }
                );
            }

            if(
                req.user._id.toString() !== careGive.careGiver.careGiverId.toString()
                && req.user._id.toString() !== careGive.petOwner.petOwnerId.toString()
            ){
                return res.status(401).json(
                    {
                        error: true,
                        message: "You are not authorized to report this mission"
                    }
                );
            }

            const mission = careGive.missionCallender.find(
                missionObject =>
                    missionObject._id.toString() === missionId
            );
            if(!mission){
                return res.status(404).json(
                    {
                        error: true,
                        message: "Mission not found"
                    }
                );
            }

            await new ReportMission(
                {
                    reportingUserId: req.user._id.toString(),
                    careGiveId: careGive._id.toString(),
                    petOwnerId: careGive.petOwner.petOwnerId.toString(),
                    petId: careGive.petId.toString(),
                    careGiverId: careGive.careGiver.careGiverId.toString(),
                    missionId: mission._id.toString(),
                    missionDate: mission.missionDate,
                    missionDesc: mission.missionDesc,
                    isExtraService: mission.extra.isExtra,
                    requiredPassword: mission.missionContent.timeSignature.timePassword,
                    videoUrl: mission.missionContent.videoUrl,
                    isMissionAproved: mission.missionContent.isApproved,
                    reportDesc: reportDesc
                }
            ).then(
                (report) => {
                    return res.status(200).json(
                        {
                            error: false,
                            message: `mission reported with the id: ${report._id.toString()}`
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
            console.log("ERROR: report mission", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);

router.use("/schedule", scheduleMissionEndPoints);

export default router;