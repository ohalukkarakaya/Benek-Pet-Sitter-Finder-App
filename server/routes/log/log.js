import express from "express";
import adminAuth from "../../middleware/adminAuth.js";

//controllers
import getLogsByPeriodController from "../../controllers/logRoutesControllers/getLogsByPeriodController.js";
import getLogsByUserIdController from "../../controllers/logRoutesControllers/getLogsByUserIdController.js";
import getLogsByRequestUrlController from "../../controllers/logRoutesControllers/getLogsByRequestUrlController.js";
import getLogsByUserIdAndDatePeriodController from "../../controllers/logRoutesControllers/getLogsByUserIdAndDatePeriodController.js";
import getLogsByRequestUrlAndDatePeriodController from "../../controllers/logRoutesControllers/getLogsByRequestUrlAndDatePeriodController.js";
import getLogsByRequestUrlAndUserIdController from "../../controllers/logRoutesControllers/getLogsByRequestUrlAndUserIdController.js";
import getLogsByRequestUrlUserIdAndPeriodController from "../../controllers/logRoutesControllers/getLogsByRequestUrlUserIdAndPeriodController.js";

const router = express.Router();

// - tested
// get logs by time period -> /byDatePeriod?startDate=2023-05-16&endDate=2023-05-17
router.get(
    "/byDatePeriod",
    adminAuth,
    getLogsByPeriodController
);

// - tested
// get logs by userId
router.get(
    "/byUserId/:userId",
    adminAuth,
    getLogsByUserIdController
);

// - tested
// get logs by request url
router.post(
    "/byRequestUrl",
    adminAuth,
    getLogsByRequestUrlController
);

// - tested
// get logs by userId and period -> /byUserIdAndDatePeriod/:userId/?startDate=2023-05-16&endDate=2023-05-17
router.get(
    "/byUserIdAndDatePeriod/:userId",
    adminAuth,
    getLogsByUserIdAndDatePeriodController
);

// - tested
// get logs by request url and period
router.post(
    "/byRequestUrlAndDatePeriod",
    adminAuth,
    getLogsByRequestUrlAndDatePeriodController
);

// - tested
// get logs by request url and userId
router.post(
    "/byRequestUrlAndUserId",
    adminAuth,
    getLogsByRequestUrlAndUserIdController
);

// - tested
// get logs by request url, userId and period
router.post(
    "/byRequestUrlAndUserIdAndPeriod",
    adminAuth,
    getLogsByRequestUrlUserIdAndPeriodController
);

export default router;