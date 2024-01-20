import express from "express";
import auth from "../../middleware/auth.js";

//controllers
import getNotificationController from "../../controllers/notificationRoutesControllers/getNotificationController.js";
import seeNotificationsController from "../../controllers/notificationRoutesControllers/seeNotificationsController.js";
import getUnseenNotificationCountController from "../../controllers/notificationRoutesControllers/getUnseenNotificationCountController.js";
import openNotificationsController from "../../controllers/notificationRoutesControllers/openNotificationsController.js";

const router = express.Router();

// - tested
//Get Notifications
router.get(
    "/:lastItemId/:limit",
    auth,
    getNotificationController
);

// - tested
//get unseen notification count
router.get(
  "/unSeenCount",
  auth,
  getUnseenNotificationCountController
);

// - tested
//see notification
router.post(
  "/seen",
  auth,
  seeNotificationsController
); 

// - tested
//open notification
router.post(
  "/opened",
  auth,
  openNotificationsController
); 

export default router;