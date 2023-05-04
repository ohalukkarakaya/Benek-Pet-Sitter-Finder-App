import express from "express";

//controllers
import getAllMeetingUsersController from "../../controllers/chatRoutesControllers/meetingControllers/getAllMeetingUsersController.js";
import joinMeetingController from "../../controllers/chatRoutesControllers/meetingControllers/joinMeetingController.js";
import createMeetController from "../../controllers/chatRoutesControllers/meetingControllers/createMeetController.js";

import auth from "../../middleware/auth.js";

import dotenv from "dotenv";


dotenv.config();

const router = express.Router();

//get all meeting users
router.get(
    "/getAllUsers/:chatId/:meetingId",
    auth,
    getAllMeetingUsersController
);

//join meeting
router.post(
    "/joinMeeting/:chatId/:meetingId",
    auth,
    joinMeetingController
);

// create meeting
router.post(
    "/createMeet/:chatId",
    auth,
    createMeetController
);

// To Do: check if there is meeting by id

// To Do: stop meeting

// To Do: leave meeting

export default router;