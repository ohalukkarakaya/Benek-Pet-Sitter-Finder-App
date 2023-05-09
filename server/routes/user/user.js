import express from "express";
import dotenv from "dotenv";

import auth from "../../middleware/auth.js";
import { updateProfileImg } from "../../middleware/imageHandle/serverHandleProfileImage.js";

import userSetingsRoutes from './userSettings.js';
import userInterractionsRoutes from "./userInterractions.js"

//controllers
import userGetMoreInfoController from "../../controllers/userRoutesControllers/userControllers/userGetMoreInfoController.js";
import userUpdateBirthDayController from "../../controllers/userRoutesControllers/userControllers/userUpdateBirthDayController.js";
import getLoggedInUserInfoController from "../../controllers/userRoutesControllers/userControllers/getLoggedInUserInfoController.js";
import getUserByIdController from "../../controllers/userRoutesControllers/userControllers/getUserByIdController.js";
import getUsersAndEventsByLocationController from "../../controllers/userRoutesControllers/userControllers/getUsersAndEventsByLocationController.js";
import getUsersAndEventsBySearchValueController from "../../controllers/userRoutesControllers/userControllers/getUsersAndEventsBySearchValueController.js";
import getCareGiversByLocationController from "../../controllers/userRoutesControllers/userControllers/getCareGiversByLocationController.js";
import getCareGiversBySearchValueController from "../../controllers/userRoutesControllers/userControllers/getCareGiversBySearchValueController.js";
import getLightWeightUserInfoController from "../../controllers/userRoutesControllers/userControllers/getLightWeightUserInfoController.js";

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

//get user by jwt
router.get(
  "/getLoggedInUserInfo",
  auth,
  getLoggedInUserInfoController
);

//get user by id
router.get(
  "getUserById/:userId",
  auth,
  getUserByIdController
);

//get users and events by location data
router.post(
  "/getUsersAndEventsByLocation/:skip/:limit", 
  auth,
  getUsersAndEventsByLocationController
);

//get users and events with search value
router.post(
  "/getUsersAndEventsBySearchValue/:skip/:limit", 
  auth,
  getUsersAndEventsBySearchValueController
);

//get careGivers by location
router.post(
  "/getCareGiversByLocation/:skip/:limit",
  auth,
  getCareGiversByLocationController
);

//get careGiver by search value
router.post(
  "/getCareGiversBySearchValue/:skip/:limit",
  auth,
  getCareGiversBySearchValueController
);

//get light weight user id with user id list
router.post(
  "/getLightWeightUserInfo",
  auth,
  getLightWeightUserInfoController
);

router.use( "/profileSettings", userSetingsRoutes );
router.use( "/interractions", userInterractionsRoutes );

export default router;
