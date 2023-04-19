import User from "../../../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const resetUserNameController = async (req, res) => {
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
        if(!user || user.deactivation.isDeactive){
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

export default resetUserNameController;