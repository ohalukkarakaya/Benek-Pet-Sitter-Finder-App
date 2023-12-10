import express from "express";

//controllers
import getAdminLoginQrCodeController from "../../controllers/adminRoutes/getAdminLoginQrCodeController.js";
import adminLoginController from "../../controllers/adminRoutes/adminLoginController.js";
import getReportedMissionByIdController from "../../controllers/adminRoutes/getReportedMissionByIdController.js";
import getReportedMissionListController from "../../controllers/adminRoutes/getReportedMissionListController.js";
import replyReportController from "../../controllers/adminRoutes/replyReportController.js";
import getInvoicePaperByIdController from "../../controllers/adminRoutes/getInvoicePaperByIdController.js";
import getInvoicePaperListController from "../../controllers/adminRoutes/getInvoicePaperListController.js";
import getExpensePaperByIdController from "../../controllers/adminRoutes/getExpensePaperByIdController.js";
import getExpensePaperListController from "../../controllers/adminRoutes/getExpensePaperListController.js";
import punishUserController from "../../controllers/adminRoutes/punishUserController.js";
import banUserController from "../../controllers/adminRoutes/banUserController.js";
import getActiveUserCountController from "../../controllers/adminRoutes/getActiveUserCountController.js";
import getPaymentsOnPoolController from "../../controllers/adminRoutes/getPaymentsOnPoolController.js";

import adminAuth from "../../middleware/adminAuth";

import dotenv from "dotenv";


dotenv.config();

const router = express.Router();

// get qr code
router.get(
    "/getLoginQrCode/:clientId",
    getAdminLoginQrCodeController
);

// login
router.post(
    "/login",
    adminAuth,
    adminLoginController
);

// get Rreport by id
router.get(
    "/reportedMissionById/:reportId",
    adminAuth,
    getReportedMissionByIdController
);

// get all reports
router.get(
    "/reportedMissionList/:skip/:limit",
    adminAuth,
    getReportedMissionListController
);

// reply report
router.post(
    "/replyReport/:reportId/:response",
    adminAuth,
    replyReportController
);

// get invoice paper and record info by id
router.get(
    "/getInvoicePaperById/:invoiceId",
    adminAuth,
    getInvoicePaperByIdController
);

// get all invoice list
router.get(
    "/getInvoicePaperList/:skip/:limit",
    adminAuth,
    getInvoicePaperListController
);

// get expense document by id
router.get(
    "/getExpensePaperById/:expenseId",
    adminAuth,
    getExpensePaperByIdController
);

// get all expense documents
router.get(
    "/getExpensePaperList/:skip/:limit",
    adminAuth,
    getExpensePaperListController
);

// punish user
router.post(
    "/punishUser/:userId",
    adminAuth,
    punishUserController
);

// ban user by userId
router.post(
    "/banUser/:userId",
    adminAuth,
    banUserController
);

// Count Active Users
router.get(
    "/activeUserCount",
    adminAuth,
    getActiveUserCountController
);

// Count Payment Data Prices
router.get(
    "/getPaymentsOnPool",
    adminAuth,
    getPaymentsOnPoolController
);

router.put(
    "/giveUserAuthorizationRole/:userId/:roleId",
    adminAuth,
    giveUserAuthorizationRoleController
);

router.get(
    "/getBannedUsersList/:skip/:limit",
    adminAuth,
    getBannedUsersList
)

router.delete(
    "/removeBan/:banId",
    adminAuth,
    removeBan
)

export default router;