import express from "express";
import dotenv from "dotenv";
import auth from "../../middleware/auth.js";

import missionEndPoints from "./mission/mission.js";
import emergencyEndPoints from "./emergency.js";

//controllers
import careGiveInvitationController from "../../controllers/careGiveRoutesControllers/careGiveControllers/careGiveInvitationController.js";
import replyCareGiveInvitationController from "../../controllers/careGiveRoutesControllers/careGiveControllers/replyCareGiveInvitationController.js";
import startCareGiveController from "../../controllers/careGiveRoutesControllers/careGiveControllers/startCareGiveController.js";
import extendCareGiveController from "../../controllers/careGiveRoutesControllers/careGiveControllers/extendCareGiveController.js";
import finishCareGiveController from "../../controllers/careGiveRoutesControllers/careGiveControllers/finishCareGiveController.js";
import cancelCareGiveController from "../../controllers/careGiveRoutesControllers/careGiveControllers/cancelCareGiveController.js";
import giveStarToCareGiverController from "../../controllers/careGiveRoutesControllers/careGiveControllers/giveStarToCareGiverController.js";
import getCareGiveInvitationsController from "../../controllers/careGiveRoutesControllers/careGiveControllers/getCareGiveInvitationsController.js";
import getSendedCareGiveInvitationsController from "../../controllers/careGiveRoutesControllers/careGiveControllers/getSendedCareGiveInvitationsController.js";
import getCareGiveListController from "../../controllers/careGiveRoutesControllers/careGiveControllers/getCareGiveListController.js";
import getCareGiveController from "../../controllers/careGiveRoutesControllers/careGiveControllers/getCareGiveController.js";
import getFinishedCareGiveListController from "../../controllers/careGiveRoutesControllers/careGiveControllers/getFinishedCareGiveListController.js";
import getPetOwnerCareGiveListController from "../../controllers/careGiveRoutesControllers/careGiveControllers/getPetOwnerCareGiveListController.js";
import getCareGiverCareGiveListController from "../../controllers/careGiveRoutesControllers/careGiveControllers/getCareGiverCareGiveListController.js";
import getCareGiverFinishedCareGiveListController from "../../controllers/careGiveRoutesControllers/careGiveControllers/getCareGiverFinishedCareGiveListController.js";
import getPetOwnerFinishedCareGiveListController from "../../controllers/careGiveRoutesControllers/careGiveControllers/getPetOwnerFinishedCareGiveListController.js";


dotenv.config();

const router = express.Router();

// - To Do
//invite a user to care give
router.post(
    "/",
    auth,
    careGiveInvitationController
);

//get care give invitations
router.get(
    "/invitations/:skip/:limit",
    auth,
    getCareGiveInvitationsController
);

//get sended care give invitations
router.get(
    "/sendedInvitations/:skip/:limit",
    auth,
    getSendedCareGiveInvitationsController
);

//accept invitation
router.put(
    "/:careGiveId/:response",
    auth,
    replyCareGiveInvitationController
);

//start care give
router.put(
    "/start/:careGiveId",
    auth,
    startCareGiveController
);

//get careGive list
router.get(
    "/getCareGiveList/:skip/:limit",
    auth,
    getCareGiveListController
);

//get finished careGive List
router.get(
    "/getFinishedCareGiveList/:skip/:limit",
    auth,
    getFinishedCareGiveListController
);

//get careGive by careGiveId
router.get(
    "/getCareGive/:careGiveId",
    auth,
    getCareGiveController
);

//get petOwner careGive List
router.get(
    "/getPetOwnerCareGiveList/:skip/:limit",
    auth,
    getPetOwnerCareGiveListController
);

//get petOwner Finished careGive List
router.get(
    "/getPetOwnerFinishedCareGiveList/:skip/:limit",
    auth,
    getPetOwnerFinishedCareGiveListController
);

//get CareGiver careGive List
router.get(
    "/getCareGiverCareGiveList/:skip/:limit",
    auth,
    getCareGiverCareGiveListController
);

//get CareGiver Finished careGive List
router.get(
    "/getCareGiverFinishedCareGiveList/:skip/:limit",
    auth,
    getCareGiverFinishedCareGiveListController
);

//extend care give
router.put(
    "/extend/:careGiveId",
    auth,
    extendCareGiveController
);

//finish care give
router.put(
    "/finish/:careGiveId",
    auth,
    finishCareGiveController
);

//cancel careGive
router.post(
    "/cancel/:careGiveId",
    auth,
    cancelCareGiveController
);


//give star to care giver
router.post(
    "/giveStar/:careGiveId/:star",
    auth,
    giveStarToCareGiverController
);

router.use("/mission", missionEndPoints);
router.use("/emergency", emergencyEndPoints);

export default router;