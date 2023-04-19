import express from "express";

import auth from "../../../../middleware/auth.js";

//controllers
import invitePrivateEvent from "./eventControllers/eventJoinControllers/invitePrivateEvent.js";
import acceptEventInvitation from "./eventControllers/eventJoinControllers/acceptEventInvitation.js";
import buyTicketForEvent from "./eventControllers/eventJoinControllers/buyTicketForEvent.js";
import useTicket from "./eventControllers/eventJoinControllers/useTicket.js";

const router = express.Router();

//invite to private event
router.post(
    "invitation/:eventId/:invitedUserId",
    auth,
    invitePrivateEvent
);

//accept invitation
router.put(
    "/invitation/:invitationId/:response",
    auth,
    acceptEventInvitation
);

//buy ticket for event
router.post(
    "/:eventId",
    auth,
    buyTicketForEvent
);

//use ticket
router.put(
    "/:eventId",
    auth,
    useTicket
);

export default router;