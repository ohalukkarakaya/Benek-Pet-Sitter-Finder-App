import express from "express";

import auth from "../../../middleware/auth.js";

//controllers
import scheduleMissionController from "../../../controllers/careGiveRoutesControllers/missionRoutesControllers/scheduleMissionControllers/scheduleMissionController.js";
import deleteMissionController from "../../../controllers/careGiveRoutesControllers/missionRoutesControllers/scheduleMissionControllers/deleteMissionController.js";

import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// - tested
//schedule mission
router.put(
    "/:careGiveId",
    auth,
    scheduleMissionController
);

// - To Do
//delete mission
router.delete(
    "/delete/:careGiveId/:missionId",
    auth,
    deleteMissionController 
);

export default router;