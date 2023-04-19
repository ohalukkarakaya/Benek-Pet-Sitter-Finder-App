import express from "express";

import auth from "../../../../middleware/auth.js";

//controllers
import invitePrivateEventController from "../../../../controllers/eventRoutesControllers/eventJoinControllers/invitePrivateEventController.js";
import acceptEventInvitationController from "../../../../controllers/eventRoutesControllers/eventJoinControllers/acceptEventInvitationController.js";
import buyTicketForEventController from "../../../../controllers/eventRoutesControllers/eventJoinControllers/buyTicketForEventController.js";
import useTicketController from "../../../../controllers/eventRoutesControllers/eventJoinControllers/useTicketController.js";

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

export default router;