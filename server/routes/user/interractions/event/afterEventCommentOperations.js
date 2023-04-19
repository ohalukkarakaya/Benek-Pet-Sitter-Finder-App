import express from "express";
import dotenv from "dotenv";
import auth from "../../../../middleware/auth.js";

//controllers
import afterEventCreateCommentOrReplyCommentController from "../../../../controllers/eventRoutesControllers/afterEventCommentOperationsControllers/afterEventCreateCommentOrReplyCommentController.js";
import afterEventEditCommentOrReplyController from "../../../../controllers/eventRoutesControllers/afterEventCommentOperationsControllers/afterEventEditCommentOrReplyController.js";
import afterEventDeleteCommentOrReplyController from "../../../../controllers/eventRoutesControllers/afterEventCommentOperationsControllers/afterEventDeleteCommentOrReplyController.js";
import afterEventLikeCommentOrReplyController from "../../../../controllers/eventRoutesControllers/afterEventCommentOperationsControllers/afterEventLikeCommentOrReplyController.js";

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

export default router;