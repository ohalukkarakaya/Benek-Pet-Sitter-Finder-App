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
import getUsersChatsAsAdminController from "../../controllers/adminRoutes/getUsersChatsAsAdminController.js";
import searchChatAsAdminController from "../../controllers/adminRoutes/searchChatAsAdminController.js";
import getUsersMessagesAsAdminController from "../../controllers/adminRoutes/getUsersMessagesAsAdminController.js";
import getPunishmentCountController from "../../controllers/adminRoutes/getPunishmentCountController.js";
import getPunishmentRecordsController from "../../controllers/adminRoutes/getPunishmentRecordsController.js";

import { adminAuthAny, adminAuthSuperAdmin, adminAuthEvaluator, adminAuthAccounting } from "../../middleware/adminAuth.js";

import dotenv from "dotenv";
import searchChatController from "../../controllers/chatRoutesControllers/chatControllers/searchChatController.js";



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
    "/reportedMissionList/:lastItemId/:limit",
    adminAuthEvaluator,
    getReportedMissionListController
);

// - tested
// get users chat as admin
router.get(
    "/getUsersChat/:userId/:limit/:lastItemId",
    adminAuthEvaluator,
    getUsersChatsAsAdminController
);

// - tested
// search users chat as admin
router.get(
    "/searchUsersChat/:userId/:searchText",
    adminAuthEvaluator,
    searchChatAsAdminController
);

// get users messages as admin
router.get(
    "/getUsersMessages/:userId/:chatId/:limit/:lastItemId",
    adminAuthEvaluator,
    getUsersMessagesAsAdminController
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
    "/getInvoicePaperList/:lastItemId/:limit",
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
    "/getExpensePaperList/:lastItemId/:limit",
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
// get punisment count from user id
router.get(
    "/punishmentCount/:userId",
    adminAuthEvaluator,
    getPunishmentCountController
);

// - tested
// get punisment records by user id
router.get(
    "/getPunishmentRecords/:userId",
    adminAuthEvaluator,
    getPunishmentRecordsController
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
    "/getBannedUsersList/:lastItemId/:limit",
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
    "/getEmployees/:lasItemId/:limit",
    adminAuthAny,
    getAllEmployeesController
)

export default router;