import express from "express";
import dotenv from "dotenv";
import auth from "../../middleware/auth.js";
import { upload } from "../../middleware/serverHandleProfileImage.js";

dotenv.config();
const router = express.Router();

//Get More Info Of The User After First Login
router.post(
    "/moreUserInfo",
    auth,
    upload.single("profileImg"),
    async (req, res) => {
      if (req.file) { // Checking if req.file is not empty.
        const uploadedImage = req.file.location;
        console.log(uploadedImage);
        return res.status(200).json(
          {
            error: false,
            objectName: req.newFileName,
            url: uploadedImage
          }
        );
      }
    }
  );

export default router;
