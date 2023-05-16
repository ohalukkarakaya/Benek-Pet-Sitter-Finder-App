import express from "express";
import auth from "../../middleware/auth.js";

//controllers
import getNotificationController from "../../controllers/notificationRoutesControllers/getNotificationController.js";

const router = express.Router();

//Get Notifications
router.get(
    "/:skip/:limit",
    auth,
    getNotificationController
);

  export default router;