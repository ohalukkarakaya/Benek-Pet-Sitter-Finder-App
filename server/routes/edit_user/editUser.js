import express from "express";
import dotenv from "dotenv";
import s3Uploadv2 from "../../middleware/s3Service.js";;
import auth from "../../middleware/auth.js";
import getRegionEndPoint from "../../middleware/regionEndPoint.js";

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
    getRegionEndPoint,
    s3Uploadv2,
    (req, res) => {
        res.status(200).json(
            {
                error: false,
                message: req.uploadedData
            }
        );
    }
  );

export default router;
