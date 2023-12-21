import express from "express";
import { adminAuthDeveloper } from "../../middleware/adminAuth.js";

//controllers
import getLogsByPeriodController from "../../controllers/logRoutesControllers/getLogsByPeriodController.js";
import getLogsByUserIdController from "../../controllers/logRoutesControllers/getLogsByUserIdController.js";
import getLogsByRequestUrlController from "../../controllers/logRoutesControllers/getLogsByRequestUrlController.js";
import getLogsByUserIdAndDatePeriodController from "../../controllers/logRoutesControllers/getLogsByUserIdAndDatePeriodController.js";
import getLogsByRequestUrlAndDatePeriodController from "../../controllers/logRoutesControllers/getLogsByRequestUrlAndDatePeriodController.js";
import getLogsByRequestUrlAndUserIdController from "../../controllers/logRoutesControllers/getLogsByRequestUrlAndUserIdController.js";
import getLogsByRequestUrlUserIdAndPeriodController from "../../controllers/logRoutesControllers/getLogsByRequestUrlUserIdAndPeriodController.js";
import getLogsByStatusCodeController from "../../controllers/logRoutesControllers/getLogsByStatusCodeController.js";
import getErrorLogsController from "../../controllers/logRoutesControllers/getErrorLogsController.js";

const router = express.Router();

// - tested
// get logs by time period -> /byDatePeriod?startDate=2023-05-16&endDate=2023-05-17
router.get(
    "/byDatePeriod",
    adminAuthDeveloper,
    getLogsByPeriodController
);

// - tested
// get logs by userId
router.get(
    "/byUserId/:userId",
    adminAuthDeveloper,
    getLogsByUserIdController
);

// - tested
// get logs by request url
router.post(
    "/byRequestUrl",
    adminAuthDeveloper,
    getLogsByRequestUrlController
);

// - tested
// get logs by userId and period -> /byUserIdAndDatePeriod/:userId/?startDate=2023-05-16&endDate=2023-05-17
router.get(
    "/byUserIdAndDatePeriod/:userId",
    adminAuthDeveloper,
    getLogsByUserIdAndDatePeriodController
);

// - tested
// get logs by request url and period
router.post(
    "/byRequestUrlAndDatePeriod",
    adminAuthDeveloper,
    getLogsByRequestUrlAndDatePeriodController
);

// - tested
// get logs by request url and userId
router.post(
    "/byRequestUrlAndUserId",
    adminAuthDeveloper,
    getLogsByRequestUrlAndUserIdController
);

// - tested
// get logs by request url, userId and period
router.post(
    "/byRequestUrlAndUserIdAndPeriod",
    adminAuthDeveloper,
    getLogsByRequestUrlUserIdAndPeriodController
);

// - tested
// get logs by status code,
router.get(
    "/byStatusCode/:statusCode",
    adminAuthDeveloper,
    getLogsByStatusCodeController
);

// - tested
// get logs not OK,
router.get(
    "/errorLogs",
    adminAuthDeveloper,
    getErrorLogsController
);

export default router;