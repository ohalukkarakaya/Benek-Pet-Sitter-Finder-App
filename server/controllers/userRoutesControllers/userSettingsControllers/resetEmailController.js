import User from "../../../models/User.js";
import ChangeEmailOTP from "../../../models/UserSettings/ChangeEmail.js";

import sendOTPVerificationEmailForResetPassword from "../../../utils/sendValidationEmailForResetPassword.js";
import { resetEmailBodyValidation } from "../../../utils/bodyValidation/user/userSettingsRequestsValidationSchema.js";

import dotenv from "dotenv";

dotenv.config();

const resetEmailController = async (req, res) => {
    try{
        const { error } = resetEmailBodyValidation( req.body );
        if(error){
            return res.status(400).json(
                {
                    error: true,
                    message: error.details[0].message
                }
            );
        }

        const user = await User.findById( req.user._id );
        if(!user || user.deactivation.isDeactive){
            return res.status(404).json(
                {
                    error: true,
                    message: "User couldn't found"
                }
            );
        }

        if(user.email === req.body.newEmail){
          return res.status(400).json(
              {
                  error: true,
                  message: "you can change your email only with new email"
              }
          );
        }

        const isEmailAlreadyUsed = await new User.findOne(
          {
              email: req.body.newEmail
          }
        );

        if(isEmailAlreadyUsed){
          return res.status(401).json(
              {
                  error: true,
                  message: "this email allready used by another user"
              }
          );
        }

        await ChangeEmailOTP.deleteMany({ userId: req.user._id.toString() });

        sendOTPVerificationEmailForResetPassword(
          {
              _id: req.user._id.toString(),
              email: newEmail,
          },
          res
        );
    }catch(err){
      console.log("resetPassword", err);
      return res.status(500).json(
        {
          error: true,
          message: "Internal server error"
        }
      );
    }
}

export default resetEmailController;