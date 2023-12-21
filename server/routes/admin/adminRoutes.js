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
import giveUserAuthorizationRoleController from "../../controllers/adminRoutes/giveUserAuthorizationRoleController.js";
import getBannedUsersListController from "../../controllers/adminRoutes/getBannedUsersListController.js";
import removeBanController from "../../controllers/adminRoutes/removeBanController.js";
import getAllEmployeesController from "../../controllers/adminRoutes/getAllEmployeesController.js";

import { adminAuthAny, adminAuthSuperAdmin, adminAuthEvaluator, adminAuthAccounting } from "../../middleware/adminAuth.js";

import dotenv from "dotenv";


dotenv.config();

const router = express.Router();

// - tested
// get qr code
router.get(
    "/getLoginQrCode/:clientId",
    getAdminLoginQrCodeController
);

// - tested
// login
router.post(
    "/login",
    adminAuthAny,
    adminLoginController
);

// - tested
// get Report by id
router.get(
    "/reportedMissionById/:reportId",
    adminAuthEvaluator,
    getReportedMissionByIdController
);

// - tested
// get all reports
router.get(
    "/reportedMissionList/:skip/:limit",
    adminAuthEvaluator,
    getReportedMissionListController
);

// - tested
// reply report
router.post(
    "/replyReport/:reportId/:response",
    adminAuthEvaluator,
    replyReportController
);

// - tested
// get invoice paper and record info by id
router.get(
    "/getInvoicePaperById/:invoiceId",
    adminAuthAccounting,
    getInvoicePaperByIdController
);

// - tested
// get all invoice list
router.get(
    "/getInvoicePaperList/:skip/:limit",
    adminAuthAccounting,
    getInvoicePaperListController
);

// - tested
// get expense document by id
router.get(
    "/getExpensePaperById/:expenseId",
    adminAuthAccounting,
    getExpensePaperByIdController
);

// - tested
// get all expense documents
router.get(
    "/getExpensePaperList/:skip/:limit",
    adminAuthAccounting,
    getExpensePaperListController
);

// - tested
// punish user
router.post(
    "/punishUser/:userId",
    adminAuthEvaluator,
    punishUserController
);

// - tested
// ban user by userId
router.post(
    "/banUser/:userId",
    adminAuthEvaluator,
    banUserController
);

// - tested
// Count Active Users
router.get(
    "/activeUserCount",
    adminAuthAny,
    getActiveUserCountController
);

// - tested
// Count Payment Data Prices
router.get(
    "/getPaymentsOnPool",
    adminAuthAccounting,
    getPaymentsOnPoolController
);

// - tested
// Give User Authorization Role
router.put(
    "/giveUserAuthorizationRole/:userId/:roleId",
    adminAuthSuperAdmin,
    giveUserAuthorizationRoleController
);

// - tested
// Get Banned Users
router.get(
    "/getBannedUsersList/:skip/:limit",
    adminAuthEvaluator,
    getBannedUsersListController
)

// - tested
// Remove Ban
router.delete(
    "/removeBan/:banId",
    adminAuthEvaluator,
    removeBanController
)

// - tested
// Get Employees
router.get(
    "/getEmployees/:skip/:limit",
    adminAuthAny,
    getAllEmployeesController
)

export default router;