import express from "express";

//controllers
import sendMessageController from "../../controllers/chatRoutesControllers/messagesControllers/sendMessageController.js";
import seeMessagesController from "../../controllers/chatRoutesControllers/messagesControllers/seeMessagesController.js";
import getMessagesController from "../../controllers/chatRoutesControllers/messagesControllers/getMessagesController.js";

import auth from "../../middleware/auth.js";

import serverHandleChatFileHelper from "../../utils/fileHelpers/serverHandleChatFileHelper.js";

import dotenv from "dotenv";


dotenv.config();

const router = express.Router();

// - tested
//send message
router.post(
    "/send/:chatId/:messageType",
    auth,
    serverHandleChatFileHelper,
    sendMessageController
);

//see messages
router.post(
    "/see/:chatId",
    auth,
    seeMessagesController
);

//get messages
router.get(
    "/get/:chatId/:skip/:limit",
    auth,
    getMessagesController
);

export default router;