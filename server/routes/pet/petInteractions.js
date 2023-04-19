import express from "express";
import Pet from "../../models/Pet.js";
import auth from "../../middleware/auth.js";
import { petImageCommentValidation, petEditImageCommentValidation, petDeleteImageCommentValidation } from "../../utils/bodyValidation/pets/petImageCommentsValidationSchemas.js";

//controllers
import followPetController from "../../controllers/petRoutesControllers/petInterractionsControllers/followPetController.js";
import petLikeImageOrRemoveLikeController from "../../controllers/petRoutesControllers/petInterractionsControllers/petLikeImageOrRemoveLikeController.js";
import petLikeImageCommentController from "../../controllers/petRoutesControllers/petInterractionsControllers/petLikeImageCommentController.js";
import petImageCreateCommentOrReplyCommentController from "../../controllers/petRoutesControllers/petInterractionsControllers/petImageCreateCommentOrReplyCommentController.js";
import petImageEditCommentOrReplyController from "../../controllers/petRoutesControllers/petInterractionsControllers/petImageEditCommentOrReplyController.js";
import petImageDeleteCommentOrReplyController from "../../controllers/petRoutesControllers/petInterractionsControllers/petImageDeleteCommentOrReplyController.js";

const router = express.Router();

//follow pet
router.put(
    "/followPet/:petId",
    auth,
    followPetController
)

//like image or remove like
router.put(
    "/likeImage",
    auth,
    petLikeImageOrRemoveLikeController
);

//like comment or reply
router.put(
    "/likeComment",
    auth,
    petLikeImageCommentController
);

//pet image leave comments and reply comment
router.put(
    "/petImageComment",
    auth,
    petImageCreateCommentOrReplyCommentController
);

//edit comment and reply
router.put(
    "/petEditImageComment",
    auth,
    petImageEditCommentOrReplyController
);

//delete pet image comment and replies
router.delete(
    "/petImageComment",
    auth,
    petImageDeleteCommentOrReplyController
);

export default router;