import express from "express";
import Story from "../../../../models/Story.js";
import auth from "../../../../middleware/auth.js";

//controllers
import storyCreateCommentOrReplyCommentController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/storyRoutesControllers/storyCommentsControllers/storyCreateCommentOrReplyCommentController.js";
import storyEditCommentOrReplyController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/storyRoutesControllers/storyCommentsControllers/storyEditCommentOrReplyController.js";
import storyDeleteCommentOrReplyController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/storyRoutesControllers/storyCommentsControllers/storyDeleteCommentOrReplyController.js";

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

export default router;