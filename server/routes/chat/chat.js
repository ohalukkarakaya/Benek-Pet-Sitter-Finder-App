import express from "express";
import dotenv from "dotenv";

import auth from "../../middleware/auth.js";
import serverHandleChatImageHelper from "../../utils/fileHelpers/serverHandleChatImageHelper.js";

//controllers
import createChatController from "../../controllers/chatRoutesControllers/chatControllers/createChatController.js";
import addMemberToChatController from "../../controllers/chatRoutesControllers/chatControllers/addMemberToChatController.js";
import leaveChatController from "../../controllers/chatRoutesControllers/chatControllers/leaveChatController.js";
import updateChatNameController from "../../controllers/chatRoutesControllers/chatControllers/updateChatNameController.js";
import updateChatDescController from "../../controllers/chatRoutesControllers/chatControllers/updateChatDescController.js";
import getChatsController from "../../controllers/chatRoutesControllers/chatControllers/getChatsController.js";
import searchChatController from "../../controllers/chatRoutesControllers/chatControllers/searchChatController.js";

import messagesRoutes from "./messages.js";
import meetingRoutes from "./meeting.js";

dotenv.config();
const router = express.Router();

// - tested
//Create Chat
router.post(
    "/create",
    auth,
    createChatController
);

// - tested
//Add Member to Chat
router.post(
    "/addMember/:chatId/:userId",
    auth,
    addMemberToChatController
);

// - tested
//leave chat
router.delete(
    "/leave/:chatId",
    auth,
    leaveChatController
);

// - tested
//add chat image
router.post(
    "/image/:chatId",
    auth,
    serverHandleChatImageHelper
);

// - tested
//add chat name
router.post(
    "/name/:chatId",
    auth,
    updateChatNameController
);

// - tested
//edit chat desc
router.post(
    "/desc/:chatId",
    auth,
    updateChatDescController
);

// - tested
//get chats
router.get(
    "/get/:lastItemId/:limit",
    auth,
    getChatsController
);

// - tested
//search chat
router.get(
    "/search/:searchValue",
    auth,
    searchChatController
);

//message routes
router.use( "/messages", messagesRoutes );

//meeting routes
router.use( "/meeting", meetingRoutes );

export default router;
