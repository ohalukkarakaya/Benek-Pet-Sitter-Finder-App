import express from "express";
import auth from "../../middleware/auth.js";

//controllers
import getNotificationController from "../../controllers/notificationRoutesControllers/getNotificationController.js";
import seeNotificationsController from "../../controllers/notificationRoutesControllers/seeNotificationsController.js";

const router = express.Router();

//Get Notifications
router.get(
    "/:skip/:limit",
    auth,
    getNotificationController
);

//see notification
router.post(
  "/seen",
  auth,
  seeNotificationsController
); 

  export default router;