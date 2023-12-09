import express from "express";

//controllers
import getAdminLoginQrCodeController from "../../controllers/adminRoutes/getAdminLoginQrCodeController.js";
import adminLoginController from "../../controllers/adminRoutes/adminLoginController.js";
import getReportedMissionByIdController from "../../controllers/adminRoutes/getReportedMissionByIdController.js";
import getReportedMissionListController from "../../controllers/adminRoutes/getReportedMissionListController.js";
import replyReportController from "../../controllers/adminRoutes/replyReportController.js";

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


router.get(
    "/getInvoicePaperById/:invoiceId",
    adminAuth,
    getInvoicePaperByIdController
);

router.get(
    "/getInvoicePaperList/:skip/:limit",
    adminAuth,
    getInvoicePaperListController
);

router.get(
    "/getExpensePaperById/:expenseId",
    adminAuth,
    getExpensePaperByIdController
);

router.get(
    "/getExpensePaperList/:skip/:limit",
    adminAuth,
    getExpensePaperListController
);

router.post(
    "/punishUser/:userId",
    adminAuth,
    punishUserController
);

router.post(
    "/banUser/:userId",
    adminAuth,
    banUserController
);

router.get(
    "/activeUserCount",
    adminAuth,
    getActiveUserCountController
);

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

export default router;