import auth from "../middleware/auth.js";

import express from "express";
const router = express.Router();
import dotenv from "dotenv";

import threeDRedirectRouteController from "../controllers/paymentRoutes/threeDRedirectRouteController.js";
import threeDRedirectGetRouteController from "../controllers/paymentRoutes/threeDRedirectGetRouteController.js";
import getRegisteredCardsListController from "../controllers/paymentRoutes/getRegisteredCardsListController.js";
import deleteRegisteredCardController from "../controllers/paymentRoutes/deleteRegisteredCardController.js";

// - tested
//redirect post route
router.post(
    "/redirect", 
    threeDRedirectRouteController
);

// - tested
//redirection get route for webView
router.get(
    "/redirect",
    threeDRedirectGetRouteController
);

// - tested
// get cards
router.get(
    "/getRegisteredCards",
    auth,
    getRegisteredCardsListController
);

// - tested
// delete card
router.delete(
    "/deleteCard/:cardToken",
    auth,
    deleteRegisteredCardController
)

export default router;