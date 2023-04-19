import express from "express";

//controllers
import signUpController from "../../controllers/authRoutesControllers/authControllers/signUpController.js";
import logInController from "../../controllers/authRoutesControllers/authControllers/logInController.js";
import verifyOtpController from "../../controllers/authRoutesControllers/authControllers/verifyOtpController.js";
import resendOtpCodeController from "../../controllers/authRoutesControllers/authControllers/resendOtpCodeController.js";

import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

//SignUp
router.post(
  "/signUp", 
  signUpController
);
  
//LogIn
router.post(
  "/login",
  logInController
);

// Verify OTP
router.post(
  "/verifyOTP",
  verifyOtpController
);

// Resend OTP Code
router.post(
  "/resendOtp",
  resendOtpCodeController
);

export default router;
