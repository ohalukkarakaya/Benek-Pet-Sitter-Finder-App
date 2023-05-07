import express from "express";

//controllers
import getAllMeetingUsersController from "../../controllers/chatRoutesControllers/meetingControllers/getAllMeetingUsersController.js";
import createMeetController from "../../controllers/chatRoutesControllers/meetingControllers/createMeetController.js";
import isMeetingExistsController from "../../controllers/chatRoutesControllers/meetingControllers/isMeetingExistsController.js";

import auth from "../../middleware/auth.js";

import dotenv from "dotenv";


dotenv.config();

const router = express.Router();

// get all meeting users
router.get(
    "/getAllUsers/:chatId/:meetingId",
    auth,
    getAllMeetingUsersController
);

// create meeting
router.post(
    "/createMeet/:chatId",
    auth,
    createMeetController
);

// check if there is meeting by id
router.get(
    "/isMeetingExist/:chatId/:meetingId",
    auth,
    isMeetingExistsController
);

// To Do: stop meeting

// To Do: leave meeting

export default router;