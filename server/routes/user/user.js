import express from "express";
import dotenv from "dotenv";

import auth from "../../middleware/auth.js";
import { updateProfileImg } from "../../middleware/imageHandle/serverHandleProfileImage.js";

import userSetingsRoutes from './userSettings.js';
import userInterractionsRoutes from "./userInterractions.js"

//controllers
import userGetMoreInfoController from "../../controllers/userRoutesControllers/userControllers/userGetMoreInfoController.js";
import userUpdateBirthDayController from "../../controllers/userRoutesControllers/userControllers/userUpdateBirthDayController.js";
import getUsersAndEventsByLocationController from "../../controllers/userRoutesControllers/userControllers/getUsersAndEventsByLocationController.js";

dotenv.config();
const router = express.Router();

//Get More Info Of The User After First Login
router.post(
  "/moreUserInfo",
  auth,
  updateProfileImg,
  userGetMoreInfoController
);

//update birthday
router.put(
  "/birthday",
  auth,
  userUpdateBirthDayController
);

//get users and events for main screen
router.post(
  '/users', 
  auth,
  getUsersAndEventsByLocationController
);

router.use( "/profileSettings", userSetingsRoutes );
router.use( "/interractions", userInterractionsRoutes );

export default router;
