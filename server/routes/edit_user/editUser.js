import express from "express";
import dotenv from "dotenv";
import auth from "../../middleware/auth.js";
import User from "../../models/User.js";
import { updateProfileImg } from "../../middleware/serverHandleProfileImage.js";


dotenv.config();
const router = express.Router();

//Get More Info Of The User After First Login
router.post(
    "/moreUserInfo",
    auth,
    updateProfileImg,
    async (req, res, next) => {

      let succesResponse;

      //if there is existing images and they uploaded to media server
      if (req.files) {

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

        next();
      }

      //save job info if its not null
      if(req.body.job){
        console.log(req.body.job);
        await User.findByIdAndUpdate(
          req.user._id,
          { "identity.job": req.body.job },
          {
            new: true,
            upsert: true,
          },
          (err, data) => {
            if(err){
              res.status(500).json(
                {
                  error: true,
                  message: "Internal server error"
                }
              )
            }else{
              res.status(200).json(
                {
                  data
                }
              )
            }
          }
        );
      }else{
        return res.status(404).json({
          error: true,
          message: "empty request"
        });
      }
    });

export default router;
