import { Router } from "express";

//controllers
import getNewAccessTokenController from "../../controllers/authRoutesControllers/refreshTokenControllers/getNewAccessTokenController.js";
import logoutController from "../../controllers/authRoutesControllers/refreshTokenControllers/logoutController.js";

const router = Router();

// - tested
// Get new access token
router.post(
    "/",
    getNewAccessTokenController
);

// - tested
// Logout
router.delete(
    "/",
    logoutController
);

export default router;