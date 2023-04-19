import express from "express";
import auth from "../../middleware/auth.js";

//controllers
import emergencyController from "../../controllers/careGiveRoutesControllers/emergencyController.js";

import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post(
    "/:careGiveId",
    auth,
    emergencyController
);

export default router;