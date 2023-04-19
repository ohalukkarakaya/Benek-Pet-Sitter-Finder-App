import express from "express";
import dotenv from "dotenv";
import auth from "../../../../middleware/auth.js";
import { uploadEventImage } from "../../../../middleware/contentHandle/serverHandleEventImage.js";

//imported endpoints
import eventJoinEndpoints from "./eventJoin.js";
import afterEventEndpoints from "./eventGuestInterractions.js";
import organizerEndpoints from "./organizerOperations.js";

//controllers
import createEventController from "../../../../controllers/eventRoutesControllers/eventControllers/createEventController.js";
import uploadEventImageController from "../../../../controllers/eventRoutesControllers/eventControllers/uploadEventImageController.js";
import editEventController from "../../../../controllers/eventRoutesControllers/eventControllers/editEventController.js";
import deleteEventController from "../../../../controllers/eventRoutesControllers/eventControllers/deleteEventController.js";

dotenv.config();

const router = express.Router();

//create event
router.post(
    "/",
    auth,
    uploadEventImage,
    createEventController
);

//upload event image
router.put(
    "/image/:eventId",
    auth,
    uploadEventImage,
    uploadEventImageController
);

//edit event
router.put(
    "/:eventId",
    auth,
    editEventController
);

//delete event
router.delete(
    "/:eventId",
    auth,
    deleteEventController
);

//organizer operations
router.use("/organizer", organizerEndpoints);

//join events
router.use("/eventJoin", eventJoinEndpoints);

//after event interractions
router.use("/afterEvent", afterEventEndpoints);

export default router;