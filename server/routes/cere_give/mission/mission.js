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
import getMissionListByCareGiveIdController from "../../../controllers/careGiveRoutesControllers/missionRoutesControllers/missionControllers/getMissionListByCareGiveIdController.js";
import getMissionCallenderController from "../../../controllers/careGiveRoutesControllers/missionRoutesControllers/missionControllers/getMissionListByCareGiveIdController.js";
import getMissionCallenderByPetIdController from "../../../controllers/careGiveRoutesControllers/missionRoutesControllers/missionControllers/getMissionCallenderByPetIdController.js";

dotenv.config();

const router = express.Router();

// - 
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
    "/approve/:careGiveId/:missionId",
    auth,
    approveMissionController
);

//report mission
router.put(
    "/report/:careGiveId/:missionId",
    auth,
    reportMissionController
);

//get mission list by careGiveId
router.get(
    "/getMissionCalenderByCareGiveId/:careGiveId/:skip/:limit",
    auth,
    getMissionListByCareGiveIdController
);

//get releated missions by userId
router.get(
    "/getMissionCalender/:skip/:limit",
    auth,
    getMissionCallenderController
);

//get missions by pet id
router.get(
    "/getMissionCalenderByPetId/:petId/:skip/:limit",
    auth,
    getMissionCallenderByPetIdController
);

router.use("/schedule", scheduleMissionEndPoints);

export default router;