import express from "express";
import dotenv from "dotenv";
import upload from "../../middleware/profileImage.js";;
import auth from "../../middleware/auth.js";

dotenv.config();
const router = express.Router();

//Get More Info Of The User After First Login
// router.put(
//     "/moreUserInfo",
//     auth,
//     async (req, res) => {
//       try{
//         res.status(200).json(
//             {
//                 error: false
//             }
//         );
//       }catch(err){
//           console.log(err);
//           res.status(500).json(
//               {
//                   error: true,
//                   message: "Internal Server Error"
//               }
//           );
//       }
//     }
//   );

//Upload Profile Image
router.post(
    "/uploadProfile",
    auth,
    upload.single("file"),
    (req, res) => {
        res.status(200).json(
            {
                error: false,
                message: "uploaded"
            }
        );
    }
  );

export default router;
