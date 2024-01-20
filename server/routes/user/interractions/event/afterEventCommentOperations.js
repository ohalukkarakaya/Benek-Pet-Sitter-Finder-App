//controllers
import afterEventCreateCommentOrReplyCommentController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/afterEventCommentOperationsControllers/afterEventCreateCommentOrReplyCommentController.js";
import afterEventEditCommentOrReplyController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/afterEventCommentOperationsControllers/afterEventEditCommentOrReplyController.js";
import afterEventDeleteCommentOrReplyController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/afterEventCommentOperationsControllers/afterEventDeleteCommentOrReplyController.js";
import afterEventLikeCommentOrReplyController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/afterEventCommentOperationsControllers/afterEventLikeCommentOrReplyController.js";
import getAfterEventCommentsController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/afterEventCommentOperationsControllers/getAfterEventCommentsController.js";
import getRepliesOfAfterEventCommentController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/afterEventCommentOperationsControllers/getRepliesOfAfterEventCommentController.js"

import express from "express";
import dotenv from "dotenv";
import auth from "../../../../middleware/auth.js";

dotenv.config();

const router = express.Router();

// - tested
//create comment or reply comment of content
router.put(
    "/:eventId/:contentId",
    auth,
    afterEventCreateCommentOrReplyCommentController
);

// - tested
//edit comment or reply
router.put(
    "/edit/:eventId/:contentId",
    auth,
    afterEventEditCommentOrReplyController
);

// - tested
//delete comment or reply
router.delete(
    "/:eventId/:contentId",
    auth,
    afterEventDeleteCommentOrReplyController
);

// - tested
//like comment
router.put(
    "/like/:eventId/:contentId",
    auth,
    afterEventLikeCommentOrReplyController
);

// - tested
//get comment list by afterEvent Id
router.get(
    "/getComments/:eventId/:contentId/:lastItemId/:limit",
    auth,
    getAfterEventCommentsController
);

// - tested
//comment replies
router.get(
    "/getReplies/:eventId/:contentId/:commentId/:lastItemId/:limit",
    auth,
    getRepliesOfAfterEventCommentController
);

export default router;