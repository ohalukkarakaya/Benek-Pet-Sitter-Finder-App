import express from "express";
import dotenv from "dotenv";
import auth from "../../middleware/auth.js";
import { updateProfileImg } from "../../middleware/serverHandleProfileImage.js";
import formidable from "formidable";

dotenv.config();
const router = express.Router();

//Get More Info Of The User After First Login
router.post(
    "/moreUserInfo",
    auth,
    updateProfileImg,
    async (req, res) => {
          // updateProfileImg(req, res, next);
          if (req.file) { // Checking if req.file is not empty.
            const uploadedImage = req.file.location;
            console.log(uploadedImage);
            return res.status(200).json(
              {
                error: false,
                imgUrl: uploadedImage
              }
            );
          }
      });

export default router;
