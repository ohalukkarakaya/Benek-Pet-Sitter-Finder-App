import express from "express";
import dotenv from "dotenv";
import auth from "../../../../middleware/auth.js";

import afterEventCommentEndpoints from "./afterEventCommentOperations.js";

import serverHandleAfterEventContentHelper from "../../../../utils/fileHelpers/serverHandleAfterEventContentHelper.js";

//controllers
import eventUploadContentController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventGuestInterractionsControllers/eventUploadContentController.js";
import eventEditContentController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventGuestInterractionsControllers/eventEditContentController.js";
import eventDeleteContentController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventGuestInterractionsControllers/eventDeleteContentController.js";
import afterEventContentLikeRemoveLikeController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventGuestInterractionsControllers/afterEventContentLikeRemoveLikeController.js";
import getAfterEventContentListController from "../../../../controllers/userRoutesControllers/userInterractionsControllers/eventRoutesControllers/eventGuestInterractionsControllers/getAfterEventContentListController.js";

dotenv.config();

const router = express.Router();

// - tested
// upload content
router.post(
    "/:eventId",
    auth,
    serverHandleAfterEventContentHelper,
    eventUploadContentController
);

// - tested
// edit content
router.put(
    "/:eventId/:contentId",
    auth,
    serverHandleAfterEventContentHelper,
    eventEditContentController
);

// - tested
// delete content
router.delete(
    "/:eventId/:contentId",
    auth,
    eventDeleteContentController
);

// - tested
//like or remove like after event content
router.put(
    "/like/:eventId/:contentId",
    auth,
    afterEventContentLikeRemoveLikeController
);


// - tested
//get after event content list by event Id
router.get(
    "/get/:eventId/:lastItemId/:limit",
    auth,
    getAfterEventContentListController
);

router.use( "/comment", afterEventCommentEndpoints );

export default router;