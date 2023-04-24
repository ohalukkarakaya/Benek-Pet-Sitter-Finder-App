import express from "express";

//controllers
import sendMessageController from "../../controllers/chatRoutesControllers/messagesControllers/sendMessageController.js";

import auth from "../../middleware/auth.js";
import { uploadChatFile } from "../../middleware/imageHandle/serverHandleChatFile.js";

import dotenv from "dotenv";


dotenv.config();

const router = express.Router();

//send message
router.post(
    "/send/:chatId",
    auth,
    uploadChatFile,
    sendMessageController
);

export default router;