import express from "express";
import dotenv from "dotenv";

import auth from "../../middleware/auth.js";

//controllers
import createChatController from "../../controllers/chatRoutes/createChatController.js";
import addMemberToChatController from "../../controllers/chatRoutes/addMemberToChatController.js";
import leaveChatController from "../../controllers/chatRoutes/leaveChatController.js";

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

export default router;
