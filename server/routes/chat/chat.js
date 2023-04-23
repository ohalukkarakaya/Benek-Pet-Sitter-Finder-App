import express from "express";
import dotenv from "dotenv";

import auth from "../../middleware/auth.js";
import { updateChatImg } from "../../middleware/imageHandle/serverHandleChatImage.js";

//controllers
import createChatController from "../../controllers/chatRoutes/createChatController.js";
import addMemberToChatController from "../../controllers/chatRoutes/addMemberToChatController.js";
import leaveChatController from "../../controllers/chatRoutes/leaveChatController.js";
import updateChatNameController from "../../controllers/chatRoutes/updateChatNameController.js";

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
router.put(
    "/name/:chatId",
    auth,
    updateChatNameController
);

//To Do: add chat desc

//To Do: get chats

export default router;
