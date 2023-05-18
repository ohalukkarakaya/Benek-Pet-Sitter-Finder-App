import express from "express";
import auth from "../../middleware/auth.js";

//controllers
import getPetKeywordsController from "../../controllers/key_wordsRoutesControllers/animalCategoryControllers/getPetKeywordsController.js";
import insertKeyWordsController from "../../controllers/key_wordsRoutesControllers/animalCategoryControllers/insertKeyWordsController.js";
import getUsersByTagController from "../../controllers/key_wordsRoutesControllers/animalCategoryControllers/getUsersByTagController.js";

const router = express.Router();

//Get Pet Keywords
router.get(
    "/:language",
    auth,
    getPetKeywordsController
);

//Insert Keyword
router.post(
    "/insertInterestedPets",
    auth,
    insertKeyWordsController
)

//get users by Keyword
router.post(
    "/getUsersByTag/:skip/:limit",
    auth,
    getUsersByTagController
)

  export default router;