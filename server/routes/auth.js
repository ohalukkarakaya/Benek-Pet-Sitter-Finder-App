import { Router } from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { signUpBodyValidation } from "../utils/validationSchema.js";

const router = Router();

//SignUp
router.post(
  "/signUp", 
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

    const user = await User.findOne(
      {
        email: req.body.email
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
        ...req.body,
        password: hashPassword
      }
    ).save();

    res.status(200).json(
      {
        error: false,
        message: "Account Created Succesfully"  
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