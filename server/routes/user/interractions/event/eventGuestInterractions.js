import express from "express";
import dotenv from "dotenv";
import auth from "../../../../middleware/auth.js";
import afterEventCommentEndpoints from "./afterEventCommentOperations.js";
import { uploadEventContent } from "../../../../middleware/contentHandle/serverHandleAfterEventContent.js";

//controllers
import eventUploadContentController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventGuestInterractionsControllers/eventUploadContentController.js";
import eventEditContentController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventGuestInterractionsControllers/eventEditContentController.js";
import eventDeleteContentController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventGuestInterractionsControllers/eventDeleteContentController.js";
import afterEventContentLileRemoveLikeController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventGuestInterractionsControllers/afterEventContentLileRemoveLikeController.js";

dotenv.config();

const router = express.Router();

// upload content
router.post(
    "/:eventId",
    auth,
    uploadEventContent,
    eventUploadContentController
);

// edit content
router.put(
    "/:eventId/:contentId",
    auth,
    uploadEventContent,
    eventEditContentController
);

// delete content
router.delete(
    "/:eventId/:contentId",
    auth,
    eventDeleteContentController
);

//like or remove like after event content
router.put(
    "/like/:eventId/:contentId",
    auth,
    afterEventContentLileRemoveLikeController
);

router.use("/comment", afterEventCommentEndpoints);

export default router;