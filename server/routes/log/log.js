import express from "express";
import auth from "../../middleware/auth.js";

//controllers
import getLogsByPeriodController from "../../controllers/logRoutesControllers/getLogsByPeriodController.js";
import getLogsByUserIdController from "../../controllers/logRoutesControllers/getLogsByUserIdController.js";
import getLogsByRequestUrlController from "../../controllers/logRoutesControllers/getLogsByRequestUrlController.js";
import getLogsByUserIdAndDatePeriodController from "../../controllers/logRoutesControllers/getLogsByUserIdAndDatePeriodController.js";
import getLogsByRequestUrlAndDatePeriodController from "../../controllers/logRoutesControllers/getLogsByRequestUrlAndDatePeriodController.js";
import getLogsByRequestUrlAndUserIdController from "../../controllers/logRoutesControllers/getLogsByRequestUrlAndUserIdController.js";
import getLogsByRequestUrlUserIdAndPeriodController from "../../controllers/logRoutesControllers/getLogsByRequestUrlUserIdAndPeriodController.js";

const router = express.Router();

// get logs by time period -> /byDatePeriod?startDate=2023-05-16&endDate=2023-05-17
router.get(
    "/byDatePeriod",
    auth,
    getLogsByPeriodController
);

// get logs by userId
router.get(
    "/byUserId/:userId",
    auth,
    getLogsByUserIdController
);

// get logs by request url
router.get(
    "/byRequestUrl/:skip/:limit",
    auth,
    getLogsByRequestUrlController
);

// get logs by userId and period -> /byUserIdAndDatePeriod/:userId/?startDate=2023-05-16&endDate=2023-05-17
router.get(
    "/byUserIdAndDatePeriod/:userId",
    auth,
    getLogsByUserIdAndDatePeriodController
);

// get logs by request url and period
router.get(
    "/byRequestUrlAndDatePeriod",
    auth,
    getLogsByRequestUrlAndDatePeriodController
);

// get logs by request url and userId
router.get(
    "/byRequestUrlAndUserId",
    auth,
    getLogsByRequestUrlAndUserIdController
);

// get logs by request url, userId and period
router.get(
    "/byRequestUrlAndUserId",
    auth,
    getLogsByRequestUrlUserIdAndPeriodController
);

export default router;