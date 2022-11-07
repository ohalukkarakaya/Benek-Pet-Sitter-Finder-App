import { Router } from "express";
const User = require("../models/User.js");
import bcrypt from "bcrypt";
import generateTokens from "../utils/generateTokens.js";
import { loginBodyValidation, signUpBodyValidation } from "../utils/validationSchema.js";

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

//LogIn
router.post(
    "/login",
    async (req, res) => {
      try{
        const { error } = loginBodyValidation(req.body);
        if(error)
          res.status(400).json(
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
        if(!user)
            return res.status(401).json(
                {
                    error: true,
                    message: "Invalid email or password"
                }
            );
        const verifiedPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if(!verifiedPassword)
            return res.status(401).json(
                {
                    error: true,
                    message: "Invalid email or password"
                }
            );

        const { accessToken, refreshToken } = await generateTokens(user);

        res.status(200).json(
            {
                error: false,
                accessToken,
                refreshToken,
                message: "Logged In Successfully"
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