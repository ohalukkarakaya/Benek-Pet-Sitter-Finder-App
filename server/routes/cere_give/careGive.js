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

// - tested
//invite a user to care give
router.post(
    "/",
    auth,
    careGiveInvitationController
);

// - tested
//get care give invitations
router.get(
    "/invitations/:lastItemId/:limit",
    auth,
    getCareGiveInvitationsController
);

// - tested
//get sended care give invitations
router.get(
    "/sendedInvitations/:lastItemId/:limit",
    auth,
    getSendedCareGiveInvitationsController
);

// - tested
//start care give
router.put(
    "/start/:careGiveId",
    auth,
    startCareGiveController
);

// - tested
//get careGive list
router.get(
    "/getCareGiveList/:lastItemId/:limit",
    auth,
    getCareGiveListController
);

// - tested
//get finished careGive List
router.get(
    "/getFinishedCareGiveList/:lastItemId/:limit",
    auth,
    getFinishedCareGiveListController
);

// - tested
//get careGive by careGiveId
router.get(
    "/getCareGive/:careGiveId",
    auth,
    getCareGiveController
);

// - tested
//get petOwner careGive List
router.get(
    "/getPetOwnerCareGiveList/:lastItemId/:limit",
    auth,
    getPetOwnerCareGiveListController
);

// - tested
//get petOwner Finished careGive List
router.get(
    "/getPetOwnerFinishedCareGiveList/:lastItemId/:limit",
    auth,
    getPetOwnerFinishedCareGiveListController
);

// - tested
//get CareGiver careGive List
router.get(
    "/getCareGiverCareGiveList/:lastItemId/:limit",
    auth,
    getCareGiverCareGiveListController
);

// - tested
//get CareGiver Finished careGive List
router.get(
    "/getCareGiverFinishedCareGiveList/:lastItemId/:limit",
    auth,
    getCareGiverFinishedCareGiveListController
);

// - tested
//extend care give
router.put(
    "/extend/:careGiveId",
    auth,
    extendCareGiveController
);

// - tested
//finish care give
router.put(
    "/finish/:careGiveId",
    auth,
    finishCareGiveController
);

// - tested
//cancel careGive
router.post(
    "/cancel/:careGiveId",
    auth,
    cancelCareGiveController
);

// - tested
//give star to care giver
router.post(
    "/giveStar/:careGiveId/:star",
    auth,
    giveStarToCareGiverController
);

// - tested
// free careGive - tested | paid careGive -> payent success - tested | paid careGive -> payent fail - tested
//accept invitation
router.put(
    "/:careGiveId/:response",
    auth,
    replyCareGiveInvitationController
);

// - tested
router.use( "/mission", missionEndPoints );
router.use( "/emergency", emergencyEndPoints );

export default router;