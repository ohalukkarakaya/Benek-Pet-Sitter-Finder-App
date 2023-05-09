import express from "express";
import auth from "../../../../middleware/auth.js";

//controllers
import addOrganizerController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventOrganizerOperationsController/addOrganizerController.js";
import acceptOrganizeInvitationController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventOrganizerOperationsController/acceptOrganizeInvitationController.js";
import cancelOrganizerStatusController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventOrganizerOperationsController/cancelOrganizerStatusController.js";
import getOrganizerInvitationsController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventOrganizerOperationsController/getOrganizerInvitationsController.js";
import getSendedOrganizerInvitationsController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventOrganizerOperationsController/getSendedOrganizerInvitationsController.js";

const router = express.Router();

//add organizer
router.post(
    "/:eventId",
    auth,
    addOrganizerController
);

//get organizer invitations by user Id
router.get(
    "/getInvitations",
    auth,
    getOrganizerInvitationsController
);

//get sended organizer invitations by user id
router.get(
    "/getSendedInvitations",
    auth,
    getSendedOrganizerInvitationsController
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