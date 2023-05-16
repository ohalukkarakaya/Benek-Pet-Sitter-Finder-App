import express from "express";
import auth from "../../middleware/auth.js";

//controllers
import getNotificationController from "../../controllers/notificationRoutesControllers/getNotificationController.js";
import seeNotificationsController from "../../controllers/notificationRoutesControllers/seeNotificationsController.js";
import getUnseenNotificationCountController from "../../controllers/notificationRoutesControllers/getUnseenNotificationCountController.js";
import openNotificationsController from "../../controllers/notificationRoutesControllers/openNotificationsController.js";

const router = express.Router();

//Get Notifications
router.get(
    "/:skip/:limit",
    auth,
    getNotificationController
);

//get unseen notification count
router.get(
  "/unSeenCount",
  auth,
  getUnseenNotificationCountController
);

//see notification
router.post(
  "/seen",
  auth,
  seeNotificationsController
); 

//open notification
router.post(
  "/opened",
  auth,
  openNotificationsController
); 

export default router;