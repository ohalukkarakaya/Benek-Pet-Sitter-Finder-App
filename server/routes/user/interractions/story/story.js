import express from "express";
import dotenv from "dotenv";
import auth from "../../../../middleware/auth.js";
import { uploadStory } from "../../../../middleware/contentHandle/serverHandleStoryContent.js";
import storyCommentEndpoints from "./storyComments.js";

//controllers
import createStoryController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/storyRoutesControllers/storyControllers/createStoryController.js";
import deleteStoryController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/storyRoutesControllers/storyControllers/deleteStoryController.js";
import likeStoryController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/storyRoutesControllers/storyControllers/likeStoryController.js";
import getStoryByUserIdController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/storyRoutesControllers/storyControllers/getStoryByUserIdController.js";
import getRecomendedStoryListController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/storyRoutesControllers/storyControllers/getRecomendedStoryListController.js";

dotenv.config();

const router = express.Router();

// - tested
//create story
router.post(
    "/",
    auth,
    uploadStory,
    createStoryController
);

// - tested
//delete story
router.delete(
    "/",
    auth,
    deleteStoryController
);

// - tested
//like story
router.put(
    "/:storyId",
    auth,
    likeStoryController
);

// - tested
//get story by user Id
router.get(
    "/getStoryByUserId/:userId",
    auth,
    getStoryByUserIdController
);

// - To Do
//get recomended stories
router.get(
    "/getRecomendedStoryList/:skip/:limit",
    auth,
    getRecomendedStoryListController
);

router.use("comments", storyCommentEndpoints);

export default router;