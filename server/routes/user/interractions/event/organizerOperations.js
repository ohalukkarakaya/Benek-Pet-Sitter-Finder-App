import express from "express";
import auth from "../../../../middleware/auth.js";

//controllers
import addOrganizerController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventOrganizerOperationsController/addOrganizerController.js";
import acceptOrganizeInvitationController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventOrganizerOperationsController/acceptOrganizeInvitationController.js";
import cancelOrganizerStatusController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventOrganizerOperationsController/cancelOrganizerStatusController.js";
import getOrganizerInvitationsController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventOrganizerOperationsController/getOrganizerInvitationsController.js";
import getSendedOrganizerInvitationsController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventOrganizerOperationsController/getSendedOrganizerInvitationsController.js";

const router = express.Router();

// - tested
//add organizer
router.post(
    "/:eventId",
    auth,
    addOrganizerController
);

// - tested
//get organizer invitations by user Id
router.get(
    "/getInvitations/:lastElementId/:limit",
    auth,
    getOrganizerInvitationsController
);

// - tested
//get sended organizer invitations by user id
router.get(
    "/getSendedInvitations/:lastElementId/:limit",
    auth,
    getSendedOrganizerInvitationsController
);

// - tested
//accept organizer invitation
router.delete(
    "/:invateId/:response",
    auth,
    acceptOrganizeInvitationController
);

// - tested
//cancel organizer status
router.put(
    "/remove/:eventId",
    auth,
    cancelOrganizerStatusController
);

export default router;