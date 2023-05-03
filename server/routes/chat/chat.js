import express from "express";
import dotenv from "dotenv";

import auth from "../../middleware/auth.js";
import { updateChatImg } from "../../middleware/imageHandle/serverHandleChatImage.js";

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

//Create Chat
router.post(
    "/create",
    auth,
    createChatController
);

//Add Member to Chat
router.post(
    "/addMember/:chatId/:userId",
    auth,
    addMemberToChatController
);

//leave chat
router.delete(
    "/leave/:chatId",
    auth,
    leaveChatController
);

//add chat image
router.post(
    "/image/:chatId",
    auth,
    updateChatImg
);

//add chat name
router.post(
    "/name/:chatId",
    auth,
    updateChatNameController
);

//add chat desc
router.post(
    "/desc/:chatId",
    auth,
    updateChatDescController
);

//get chats
router.get(
    "/get/:skip/:limit",
    auth,
    getChatsController
);

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
