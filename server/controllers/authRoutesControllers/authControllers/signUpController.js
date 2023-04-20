import User from "../../../models/User.js";

import sendOTPVerificationEmail from "../../../utils/sendValidationEmail.js";
import { signUpBodyValidation } from "../../../utils/bodyValidation/user/signUpValidationSchema.js";

import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const signUpController = async (req, res) => {
    try{
      const { error } = signUpBodyValidation(req.body);
      if(error)
        return res.status(400).json(
          {
            error: true,
            message: error.details[0].message
          }
        );
  
      const user = await User.findOne({ email: req.body.email });
      if(user)
        return res.status(400).json(
          {
            error: true,
            message: "User Allready Exists"
          }
        );
  
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.password, salt);
  
      await new User(
        {
          userName: req.body.userName,
          email: req.body.email,
          identity: req.body.identity,
          location: req.body.location,
          password: hashPassword,
          trustedIps: [req.body.ip]
        }
      ).save().then(
        (result) => {
          // Handle account verification
          // Send verification code
          sendOTPVerificationEmail(
            {
              _id: result._id,
              email: result.email
            },
            res
          );
        }
      );
  
    }catch(err){
      console.log(err);
      res.status(500).json(
        {
          error: true,
          message: "Internal Server Error"
        }
      );
    }
}

export default signUpController;