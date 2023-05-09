//controllers
import afterEventCreateCommentOrReplyCommentController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/afterEventCommentOperationsControllers/afterEventCreateCommentOrReplyCommentController.js";
import afterEventEditCommentOrReplyController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/afterEventCommentOperationsControllers/afterEventEditCommentOrReplyController.js";
import afterEventDeleteCommentOrReplyController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/afterEventCommentOperationsControllers/afterEventDeleteCommentOrReplyController.js";
import afterEventLikeCommentOrReplyController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/afterEventCommentOperationsControllers/afterEventLikeCommentOrReplyController.js";
import getAfterEventCommentsController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/afterEventCommentOperationsControllers/getAfterEventCommentsController.js";

import express from "express";
import dotenv from "dotenv";
import auth from "../../../../middleware/auth.js";

dotenv.config();

const router = express.Router();

//create comment or reply comment of content
router.put(
    "/:eventId/:contentId",
    auth,
    afterEventCreateCommentOrReplyCommentController
);

//edit comment or reply
router.put(
    "/edit/:eventId/:contentId",
    auth,
    afterEventEditCommentOrReplyController
);

//delete comment or reply
router.delete(
    "/:eventId/:contentId",
    auth,
    afterEventDeleteCommentOrReplyController
);

//like comment
router.put(
    "/like/:eventId/:contentId/:commentId",
    auth,
    afterEventLikeCommentOrReplyController
);

//get comment list by afterEvent Id
router.get(
    "getComments/:eventId/:contentId",
    auth,
    getAfterEventCommentsController
);

export default router;