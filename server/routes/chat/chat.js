import express from "express";
import dotenv from "dotenv";

import auth from "../../middleware/auth.js";

//controllers
import createChatController from "../../controllers/chatRoutes/createChatController.js";
import addMemberToChatController from "../../controllers/chatRoutes/addMemberToChatController.js";

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
)

export default router;
