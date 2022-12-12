import express from "express";
import User from "../../models/User.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import auth from "../../middleware/auth.js";
import ChangeEmailOTP from "../../models/UserSettings/ChangeEmail.js";
import sendOTPVerificationEmailForResetPassword from "../../utils/sendValidationEmailForResetPassword.js";
import { resetPasswordBodyValidation, resetEmailBodyValidation } from "../../utils/bodyValidation/user/userSettingsRequestsValidationSchema.js";

dotenv.config();

const router = express.Router();

//reset user name
router.put(
    "/resetUsername",
    auth,
    async (req, res) => {
        try{
            const newUserName = req.body.newUserName;
            if(!newUserName){
                return res.status(400).json(
                    {
                        error: true,
                        message: "New username is required"
                    }
                );
            }

            const isUserNameAlreadyUsed = await new User.findOne(
                {
                    userName: newUserName
                }
            );
            if(isUserNameAlreadyUsed){
                return res.status(400).json(
                    {
                        error: true,
                        message: "This username already used by another user"
                    }
                );
            }

            const user = User.findById( req.user._id.toString() );
            if(!user){
                return res.status(404).json(
                    {
                        error: true,
                        message: "User not found"
                    }
                );
            }

            if(user.userName === newUserName){
                return res.status(400).json(
                    {
                        error: true,
                        message: "You can change your username only with a new one"
                    }
                );
            }

            user.userName = newUserName;
            user.markModified("userName");
            user.save(
                (err) => {
                    if(err){
                        return res.status(500).json(
                            {
                                error: true,
                                message: "ERROR: while saving new username"
                            }
                        );
                    }
                }
            );

            return res.status(200).json(
                {
                    error: false,
                    message: "Username has been updated succesfully"
                }
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
);

//reset email
router.post(
    "/resetPassword",
    auth,
    async (req, res) => {
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
          if(!user){
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
);

//verify reset email OTP
router.post(
    "/verifyResetEmailOTP",
    auth,
    async (req, res) => {
      try{
        const otp = req.body.otp;
        if( !otp ){
          req.status(400).json(
            {
              error: true,
              message: "Empty otp details are not allowed"
            }
          );
        }else{
          const ChangeEmailOTPVerificationRecords = await ChangeEmailOTP.find(
            {
              userId : req.user._id.toString()
            }
          );
          if(UserOTPVerificationRecords.length <= 0){
            //no record found
            req.status(404).json(
              {
                error: true,
                message: "Account record doesn't exist or has been verified already"
              }
            );
          }else{
            //user otp record exists
            const { expiresAt } = ChangeEmailOTPVerificationRecords[0];
            const hashedOTP = ChangeEmailOTPVerificationRecords[0].otp;
  
            if( expiresAt < Date.now()){
              //user Otp record has expired
              await ChangeEmailOTPVerificationRecords.deleteMany({ userId: req.user._id.toString() });
              res.status(405).json(
                {
                  error: true,
                  message: "Code has expired. Please request again"
                }
              );
            }else{
              const validOTP = await bcrypt.compare(otp, hashedOTP);
  
              if(!validOTP){
                //supplied OTP is wrong
                req.status(406).json(
                  {
                    error: true,
                    message: "Invalid code passed. Check your inbox"
                  }
                );
              }else{
                const user = User.findOne(
                  { _id: req.user._id.toString() },
                  async (err, user) => {
                    if(err){
                      res.status(404).json(
                        {
                            error: true,
                            message: "User not found"
                        }
                      );
                    }else{
                      //success
                      await User.updateOne(
                        {
                            _id: req.user._id.toString()
                        },
                        {
                            email: ChangeEmailOTPVerificationRecords[0].newEmail
                        }
                      );
                      await UserOTPVerification.deleteMany(
                        {
                            userId: req.user._id.toString()
                        }
                      );
                      res.status(200).json(
                        {
                          message: "Email updated succesfuly"
                        }
                      );
                    }
                  }
                );
              }
            }
          }
        }
      }catch(err){
        res.status(500).json(
          {
            error: true,
            message: "Internal server error"
          }
        );
      }
    }
);

//reset password
router.put(
  "/resetPassword",
  auth,
  async(req, res) => {
    try{
        const { error } = resetPasswordBodyValidation( req.body );
        if(error){
            return res.status(400).json(
                {
                    error: true,
                    message: error.details[0].message
                }
            );
        }

        if(req.body.oldPassword !== req.body.oldPasswordReply){
            return res.status(400).json(
                {
                    error: true,
                    message: "old passwords are not same"
                }
            );
        }

        const user = await User.findById( req.user._id );
        if(!user){
            return res.status(404).json(
                {
                    error: true,
                    message: "User couldn't found"
                }
            );
        }

        const verifiedPassword = await bcrypt.compare(
            req.body.oldPassword,
            user.password
        );
        if(!verifiedPassword){
            return res.status(401).json(
                {
                    error: true,
                    message: "invalid password"
                }
            );
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.newPassword, salt);

        user.password = hashPassword;
        user.markModified("password");
        user.save(
            (err) => {
                if(err){
                    return res.status(500).json(
                        {
                            error: true,
                            message: "ERROR: while saving new password"
                        }
                    );
                }
            }
        );

        return res.status(200).json(
            {
                error: false,
                message: "Password changed successfully"
            }
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
);

export default router;
