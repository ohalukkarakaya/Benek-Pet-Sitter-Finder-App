
//      88     YbodP  88  88                                                            88  88                         88
//                                                                                                                     88
//    dP"Yb   dP""b8 88   88 88b 88      dP""b8    db    88     88 .dP"Y8       dP""b8 88   88 Yb    dP 888888 88b 88  88
//   dP   Yb dP   `" 88   88 88Yb88     dP   `"   dPYb   88     88 `Ybo."      dP   `" 88   88  Yb  dP  88__   88Yb88  88
//   Yb   dP Yb  "88 Y8   8P 88 Y88     Yb       dP__Yb  88  .o 88 o.`Y8b      Yb  "88 Y8   8P   YbdP   88""   88 Y88   
//    YbodP   YboodP `YbodP' 88  Y8 dp   YboodP dP""""Yb 88ood8 88 8bodP' dp    YboodP `YbodP'    YP    888888 88  Y8  88
//                                  d                                     d
//                                         88                       88



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
    async (req, res, next) => {

      let profileImageSucces;
      let coverImageSucces;
      let jobSucces;
      let bioSucces;
      let successResponse;

      //if there is existing images and they uploaded to media server
      if (req.files) {

        if(req.files.profileImg){
          var uploadedProfileImgImage = req.files.profileImg[0].location;
          console.log(`Profile Image: ${uploadedProfileImgImage}`);
        }
        if(req.files.coverImg){
          var uploadedCoverImgImage = req.files.coverImg[0].location;
          console.log(`Cover Image: ${uploadedCoverImgImage}`);
        }

        if(
          req.files.profileImg
          && req.files.coverImg
        ) {
          //if there is profile image and cover image both
          profileImageSucces = uploadedProfileImgImage;
          coverImageSucces = uploadedCoverImgImage;
        }else if(
          req.files.profileImg
          && !req.files.coverImg
        ) {
          //if there is only profile image
          profileImageSucces = uploadedProfileImgImage;
        }else if(
          !req.files.profileImg
          && req.files.coverImg
        ) {
          //if there is only cover image
          coverImageSucces = uploadedCoverImgImage;
        }
        next();
      }

      //save job info if its not null
      if(req.body.job){
        req.user.identity.job = req.body.job;
        jobSucces = req.user.identity.job;
        req.user.markModified('identity');
      }

      //save bio info if its not null
      if(req.body.bio){
        if(req.body.bio.length <= 150){
          req.user.identity.bio = req.body.bio;
          bioSucces = req.user.identity.bio;
          req.user.markModified('identity');
        }else{
          return res.status(418).json(
            {
              error: true,
              message: "Bio info can't take more than 150 character."
            }
          );
        }
      }

      //check what id updated
      if(
        profileImageSucces !== null
        || coverImageSucces !== null
        || jobSucces !== null
        || bioSucces !== null
      ){
        successResponse = {
          error: false,
          profileImageUrl: profileImageSucces,
          coverImageUrl: coverImageSucces,
          job: jobSucces,
          bio: bioSucces
        };
        next();
      }

      if(successResponse !== null){
        await req.user.save(
          function (err) {
            if(err) {
                console.error('ERROR: While Update!');
            }
          }
        );
        return res.status(200).json(
          successResponse
        );
      }else{
        return res.status(400).json(
          {
            error: true,
            message: "Empty Request Body"
          }
        );
      }
    });

export default router;
