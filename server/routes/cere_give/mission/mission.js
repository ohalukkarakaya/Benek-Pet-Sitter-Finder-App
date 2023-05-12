import express from "express";
import dotenv from "dotenv";
import scheduleMissionEndPoints from "./scheduleMission.js"
import auth from "../../../middleware/auth.js";
import validateMission from "../../../middleware/validateMission.js";
import { uploadMissionContent } from "../../../middleware/contentHandle/serverHandleMissionContent.js";

//controllers
import getTimeCodeForUploadMissionController from "../../../controllers/careGiveRoutesControllers/missionRoutesControllers/missionControllers/getTimeCodeForUploadMissionController.js";
import uploadMissionController from "../../../controllers/careGiveRoutesControllers/missionRoutesControllers/missionControllers/uploadMissionController.js";
import approveMissionController from "../../../controllers/careGiveRoutesControllers/missionRoutesControllers/missionControllers/approveMissionController.js";
import reportMissionController from "../../../controllers/careGiveRoutesControllers/missionRoutesControllers/missionControllers/reportMissionController.js";

dotenv.config();

const router = express.Router();

//get time code for upload mission
router.put(
    "/timeSignatureCode/:careGiveId/:missionId",
    auth,
    getTimeCodeForUploadMissionController
);

//upload mission
router.post(
    "/:careGiveId/:missionId",
    auth,
    validateMission,
    uploadMissionContent,
    uploadMissionController
);

//approve mission
router.put(
    "/:careGiveId/:missionId",
    auth,
    approveMissionController
);

//report mission
router.put(
    "/report/:careGiveId/:missionId",
    auth,
    reportMissionController
);

//To Do: get mission list

//To Do: get mission detail

router.use("/schedule", scheduleMissionEndPoints);

export default router;