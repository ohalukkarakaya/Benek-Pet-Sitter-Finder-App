import express from "express";
import dotenv from "dotenv";
import auth from "../../middleware/auth.js";

dotenv.config();

const router = express.Router();
//Get More Info Of The User After First Login
router.put(
    "/moreUserInfo",
    auth,
    async (req, res) => {
      try{
        
      }catch(err){
          console.log(err);
          res.status(500).json(
              {
                  error: true,
                  message: "Internal Server Error"
              }
          );
      }
    }
  );

export default router;
