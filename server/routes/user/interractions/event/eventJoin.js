import express from "express";

import auth from "../../../../middleware/auth.js";

//controllers
import invitePrivateEventController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventJoinControllers/invitePrivateEventController.js";
import acceptEventInvitationController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventJoinControllers/acceptEventInvitationController.js";
import buyTicketForEventController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventJoinControllers/buyTicketForEventController.js";
import useTicketController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventJoinControllers/useTicketController.js";
import getEventInvitationsController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventJoinControllers/getEventInvitationsController.js";
import getSendedEventInvitationsController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventJoinControllers/getSendedEventInvitationsController.js";

const router = express.Router();

//invite to private event
router.post(
    "invitation/:eventId/:invitedUserId",
    auth,
    invitePrivateEventController
);

//accept invitation
router.put(
    "/invitation/:invitationId/:response",
    auth,
    acceptEventInvitationController
);

//buy ticket for event
router.post(
    "/:eventId",
    auth,
    buyTicketForEventController
);

//use ticket
router.put(
    "/:eventId",
    auth,
    useTicketController
);

//get event invitations by user id
router.get(
    "/getInvitationList",
    auth,
    getEventInvitationsController
);

//get sended event invitations by user id
router.get(
    "/getInvitationList",
    auth,
    getSendedEventInvitationsController
);

export default router;