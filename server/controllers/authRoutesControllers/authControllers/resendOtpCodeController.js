import UserOTPVerification from "../../../models/UserOtpVerification.js";

import sendOTPVerificationEmail from "../../../utils/sendValidationEmail.js";

import dotenv from "dotenv";

dotenv.config();

const resendOtpCodeController = async (req, res, next) => {
    try{
        let { userId, email } = req.body;
        if(!userId || !email){
          res.status(400).json(
            {
              error: true,
              message: "Empty otp details are not allowed"
            }
          );
        }else{
          //delete existing records and re-send
          await UserOTPVerification.deleteMany({ userId });
          sendOTPVerificationEmail({
              _id: userId,
              email
            },
            res,
            null
          );}
      }catch(err){
        res.status(500).json({
          error: true,
          message: err.message
        });
      }
}

export default resendOtpCodeController;