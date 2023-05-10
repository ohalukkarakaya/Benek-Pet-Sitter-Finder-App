import express from "express";
import Story from "../../../../models/Story.js";
import auth from "../../../../middleware/auth.js";

//controllers
import storyCreateCommentOrReplyCommentController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/storyRoutesControllers/storyCommentsControllers/storyCreateCommentOrReplyCommentController.js";
import storyEditCommentOrReplyController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/storyRoutesControllers/storyCommentsControllers/storyEditCommentOrReplyController.js";
import storyDeleteCommentOrReplyController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/storyRoutesControllers/storyCommentsControllers/storyDeleteCommentOrReplyController.js";
import getStoryCommentsController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/storyRoutesControllers/storyCommentsControllers/getStoryCommentsController.js";
import getStoryCommentRepliesController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/storyRoutesControllers/storyCommentsControllers/getStoryCommentRepliesController.js"

const router = express.Router();

//story leave comment or reply comment
router.post(
    "/:storyId",
    auth,
    storyCreateCommentOrReplyCommentController
);

//story edit comment or reply
router.put(
    "/:storyId",
    auth,
    storyEditCommentOrReplyController
);

//story delete comment or reply
router.delete(
    "/:storyId",
    auth,
    storyDeleteCommentOrReplyController
);

//get comments
router.get(
    "/:storyId/:skip/:limit",
    auth,
    getStoryCommentsController
);

//get replies
router.get(
    "/getReplies/:storyId/:commentId/:skip/:limit",
    auth,
    getStoryCommentRepliesController
);

export default router;