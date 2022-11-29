import express from "express";
import Pet from "../../models/Pet.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { signUpBodyValidation } from "../../utils/validationSchema.js";
import auth from "../../middleware/auth.js";

dotenv.config();

const router = express.Router();
//SignUp
router.post(
    "/createPet", 
    auth,
    async (req, res) => {
      try{
        const { error } = signUpBodyValidation(req.body);
        if(error)
          return res.status(400).json(
            {
              error: true,
              message: error.details[0].message
            }
          );
  
      const user = await Pet.findOne(
        {
          name: req.body.name,
          primaryOwner: req.user._id,
        }
      );
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
  );

export default router;
