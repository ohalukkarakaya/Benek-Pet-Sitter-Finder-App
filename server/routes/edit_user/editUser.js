import express from "express";
import dotenv from "dotenv";
import s3Upload from "../../middleware/s3Service.js";;
import auth from "../../middleware/auth.js";
import getRegionEndPoint from "../../middleware/regionEndPoint.js";
import upload from "../../middleware/serverHandleProfileImage.js";

dotenv.config();
const router = express.Router();

//Get More Info Of The User After First Login
router.post(
    "/moreUserInfo",
    auth,
    getRegionEndPoint,
    upload.single("profileImg"),
    s3Upload
  );

export default router;
