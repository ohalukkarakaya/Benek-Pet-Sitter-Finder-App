import express from "express";

import auth from "../../../../middleware/auth.js";

//controllers
import invitePrivateEventController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventJoinControllers/invitePrivateEventController.js";
import acceptEventInvitationController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventJoinControllers/acceptEventInvitationController.js";
import buyTicketForEventController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventJoinControllers/buyTicketForEventController.js";
import useTicketController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventJoinControllers/useTicketController.js";
import getEventInvitationsController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventJoinControllers/getEventInvitationsController.js";
import getSendedEventInvitationsController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventJoinControllers/getSendedEventInvitationsController.js";
import getOwnedTicketsController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventJoinControllers/getOwnedTicketsController.js";
import getTicketByIdController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventJoinControllers/getTicketByIdController.js";
import getTicketsByEventIdController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventJoinControllers/getTicketsByEventIdController.js";

const router = express.Router();

// - tested
//invite to private event
router.post(
    "/invitation/:eventId/:invitedUserId",
    auth,
    invitePrivateEventController
);

// - pay 3d secure: tested | TO DO: accept free event
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

// - tested
//get event invitations by user id
router.get(
    "/getInvitationList/:skip/:limit",
    auth,
    getEventInvitationsController
);

// - tested
//get sended event invitations by user id
router.get(
    "/getSendedInvitationList/:skip/:limit",
    auth,
    getSendedEventInvitationsController
);

//get owned tickets
router.get(
    "/getOwnedTickets",
    auth,
    getOwnedTicketsController
);

//get ticket by id
router.get(
    "/getTicketById/:ticketId",
    auth,
    getTicketByIdController
);

//get tickets by eventId
router.get(
    "/getTicketsByEventId/:EventId",
    auth,
    getTicketsByEventIdController
);

export default router;