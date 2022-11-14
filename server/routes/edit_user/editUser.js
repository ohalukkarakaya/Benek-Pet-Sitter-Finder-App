import express from "express";
import dotenv from "dotenv";
import auth from "../../middleware/auth.js";
import { updateProfileImg } from "../../middleware/serverHandleProfileImage.js";


dotenv.config();
const router = express.Router();

//Get More Info Of The User After First Login
router.post(
    "/moreUserInfo",
    auth,
    updateProfileImg,
    async (req, res) => {
      if (req.files) { // Checking if req.files is exists.

        let succesResponse;

        if(req.files.profileImg){
          var uploadedProfileImgImage = req.files.profileImg[0].location;
          console.log(` Profile Image: ${uploadedProfileImgImage}`);
        }
        if(req.files.coverImg){
          var uploadedCoverImgImage = req.files.coverImg[0].location;
          console.log(`Cover Image: ${uploadedCoverImgImage}`);
        }

        if(
          req.files.profileImg
          && req.files.coverImg
        ) {
          succesResponse = {
            error: false,
            profileImgUrl: uploadedProfileImgImage,
            coverImgUrl: uploadedCoverImgImage
          }
        }else if(
          req.files.profileImg
          && !req.files.coverImg
        ) {
          succesResponse = {
            error: false,
            profileImgUrl: uploadedProfileImgImage,
          }
        }else if(
          !req.files.profileImg
          && req.files.coverImg
        ) {
          succesResponse = {
            error: false,
            coverImgUrl: uploadedCoverImgImage
          }
        }

        return res.status(200).json(
          succesResponse
        );
      }else{
        return res.status(200).json({
          message: "empty request"
        });
      }
      });

export default router;
