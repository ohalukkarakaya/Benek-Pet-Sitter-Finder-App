import express from "express";
import dotenv from "dotenv";
import auth from "../../middleware/auth.js";
import storyEndpoints from "./interractions/story/story.js";
import eventEndpoints from "./interractions/event/event.js";

//controllers
import userFollowController from "../../controllers/userRoutesControllers/userInterractionsControllers/userFollowController.js";

dotenv.config();

const router = express.Router();

// - tested
//follow user
router.put(
    "/followUser/:followingUserId",
    auth,
    userFollowController
);

//story endpoints
router.use("/story", storyEndpoints);

//event endpoints
router.use("/event", eventEndpoints);

export default router;