import express from "express";
import auth from "../../../../middleware/auth.js";

//controllers
import addOrganizerController from "../../../../controllers/eventRoutesControllers/eventOrganizerOperationsController/addOrganizerController.js";
import acceptOrganizeInvitationController from "../../../../controllers/eventRoutesControllers/eventOrganizerOperationsController/acceptOrganizeInvitationController.js";
import cancelOrganizerStatusController from "../../../../controllers/eventRoutesControllers/eventOrganizerOperationsController/cancelOrganizerStatusController.js";

const router = express.Router();

//add organizer
router.post(
    "/:eventId",
    auth,
    addOrganizerController
);

//accept organizer invitation
router.delete(
    "/:invateId/:response",
    auth,
    acceptOrganizeInvitationController
);

//cancel organizer status
router.put(
    "/remove/:eventId",
    auth,
    cancelOrganizerStatusController
);

export default router;