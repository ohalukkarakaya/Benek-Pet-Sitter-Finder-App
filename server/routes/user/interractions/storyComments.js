import express from "express";
import User from "../../models/User.js";
import Story from "../../models/Story.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

//story leave comment or reply comment
router.post(
    "/",
    auth,
    async (req, res) => {
        try{

        }catch(err){
            console.log("ERROR: comment story - ", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);

export default router;