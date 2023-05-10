import express from "express";

//controllers
import resetUserNameController from "../../controllers/userRoutesControllers/userSettingsControllers/resetUserNameController.js";
import resetEmailController from "../../controllers/userRoutesControllers/userSettingsControllers/resetEmailController.js";
import verifyResetEmailOtpController from "../../controllers/userRoutesControllers/userSettingsControllers/verifyResetEmailOtpController.js";
import resetPasswordController from "../../controllers/userRoutesControllers/userSettingsControllers/resetPasswordController.js";
import forgetPasswordController from "../../controllers/userRoutesControllers/userSettingsControllers/forgetPasswordController.js";
import insertPhoneNumberController from "../../controllers/userRoutesControllers/userSettingsControllers/insertPhoneNumberController.js";
import verifyPhoneNumberController from "../../controllers/userRoutesControllers/userSettingsControllers/verifyPhoneNumberController.js";
import addIdNumberController from "../../controllers/userRoutesControllers/userSettingsControllers/addIdNumberController.js";
import addAdressController from "../../controllers/userRoutesControllers/userSettingsControllers/addAdressController.js";
import updateCareGiverPaymentInfoController from "../../controllers/userRoutesControllers/userSettingsControllers/updateCareGiverPaymentInfoController.js";
import becomeCareGiverController from "../../controllers/userRoutesControllers/userSettingsControllers/becomeCareGiverController.js";
import deactivateUserController from "../../controllers/userRoutesControllers/userSettingsControllers/deactivateUserController.js";
import deleteUserController from "../../controllers/userRoutesControllers/userSettingsControllers/deleteUserController.js";
import blockUserController from "../../controllers/userRoutesControllers/userSettingsControllers/blockUserController.js";
import unblockUserController from "../../controllers/userRoutesControllers/userSettingsControllers/unblockUserController.js";
import insertCareGiverCertificateController from "../../controllers/userRoutesControllers/userSettingsControllers/insertCareGiverCertificateController.js";
import editCareGiveCertificateDescController from "../../controllers/userRoutesControllers/userSettingsControllers/editCareGiveCertificateDescController.js"
import deleteCareGiveCertificateController from "../../controllers/userRoutesControllers/userSettingsControllers/deleteCareGiveCertificateController.js"

import auth from "../../middleware/auth.js";
import { uploadCareGiverCertificate } from "../../middleware/imageHandle/serverHandleCareGiveCertificates.js";

import dotenv from "dotenv";


dotenv.config();

const router = express.Router();

//reset user name
router.put(
  "/resetUsername",
  auth,
  resetUserNameController
);

//reset email
router.post(
  "/resetEmail",
  auth,
  resetEmailController
);

//verify reset email OTP
router.post(
  "/verifyResetEmailOTP",
  auth,
  verifyResetEmailOtpController
);

//reset password
router.put(
  "/resetPassword",
  auth,
  resetPasswordController
);

//forget password
router.put(
  "/forgetMyPassword",
  forgetPasswordController
);

//insert phone number
router.post(
  "/addPhoneNumber",
  auth,
  insertPhoneNumberController
);

//verify phone number
router.post(
  "/verifyPhoneNumber",
  auth,
  verifyPhoneNumberController
);

//add ID Number
router.put(
  "/addIdNo",
  auth,
  addIdNumberController
);

//add adress
router.put(
  "/addAdress",
  auth,
  addAdressController
);

//upload user careGiver certificate
router.post(
  "/certificate",
  auth,
  uploadCareGiverCertificate,
  insertCareGiverCertificateController
);

//edt careGiver certificate desc
router.put(
  "/editCertificate",
  auth,
  editCareGiveCertificateDescController
);

//delete careGiver certificate desc
router.delete(
  "/certificate",
  auth,
  deleteCareGiveCertificateController
);

//update careGiver Payment Info
router.put(
  "/careGiverPaymentInfo",
  auth,
  updateCareGiverPaymentInfoController
);

//become care giver
router.put(
  "/becomeCareGiver",
  auth,
  becomeCareGiverController
);

//block a user
router.put(
  "block/:userId",
  auth,
  blockUserController
);

//unblock a user
router.put(
  "unblock/:userId",
  auth,
  unblockUserController
);

//deactivate user
router.put(
  "/deactivate",
  auth,
  deactivateUserController
);

//delete user
router.delete(
  "/deleteUser",
  auth,
  deleteUserController
);

export default router;
