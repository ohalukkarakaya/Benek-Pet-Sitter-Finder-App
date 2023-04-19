import express from "express";
import dotenv from "dotenv";
import auth from "../../../../middleware/auth.js";
import { uploadStory } from "../../../../middleware/contentHandle/serverHandleStoryContent.js";
import storyCommentEndpoints from "./storyComments.js";

//controllers
import createStoryController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/storyRoutesControllers/storyControllers/createStoryController.js";
import deleteStoryController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/storyRoutesControllers/storyControllers/deleteStoryController.js";
import likeStoryController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/storyRoutesControllers/storyControllers/likeStoryController.js";

dotenv.config();

const router = express.Router();

//create story
router.post(
    "/",
    auth,
    uploadStory,
    createStoryController
);

//delete story
router.delete(
    "/",
    auth,
    deleteStoryController
);

//like story
router.put(
    "/:storyId",
    auth,
    likeStoryController
);

router.use("comments", storyCommentEndpoints);

export default router;