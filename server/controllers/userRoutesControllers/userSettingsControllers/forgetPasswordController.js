import User from "../../../models/User.js";

import sendOneTimePassword from "../../../utils/sendOneTimePasswordEmail.js";

import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const forgetPasswordController = async (req, res) => {
    try{
        const email = req.body.email;
        if(!email){
            return res.status(400).json(
                {
                    error: true,
                    message: "Email required"
                }
            );
        }

        const user = User.findOne(
            {
                email: req.body.email
            }
        );
        if( !user || user.deactivation.isDeactive ){
            return res.status(404).json(
                {
                    error: true,
                    message: "User couldn't found"
                }
            );
        }

        const oneTimePassword = `${Math.floor(100000 + Math.random() * 900000)}`;
        
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedOneTimePassword = await bcrypt.hash(otp, salt);

        sendOneTimePassword({oneTimePassword, email}, res);

        user.password = hashedOneTimePassword;
        user.markModified("password");
        user.save(
            (err) => {
                if(err){
                    return res.status(500).json(
                        {
                            error: true,
                            message: "ERROR: while saving one time password"
                        }
                    );
                }
            }
        );

        return res.status(200).json(
            {
                error: false,
                message: "New password send to your email"
            }
        );
    }catch(err){
        console.log("error - forget my password", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default forgetPasswordController;