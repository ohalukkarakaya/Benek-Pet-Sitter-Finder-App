import UserToken from "../../../models/UserToken.js";
import { refreshTokenBodyValidation } from "../../../utils/bodyValidation/user/signUpValidationSchema.js";

const logoutController = async (req, res) => {
    try{
        const { error } = refreshTokenBodyValidation(req.body);
        if(error){
            return res.status(400).json(
                {
                    error: true,
                    message: error.details[0].message
                }
            );
        }else{
            const userToken = await UserToken.findOne(
                {
                    token: req.body.refreshToken,
                }
            );
            if(!userToken){
                return res.status(200).json(
                    {
                        error: false,
                        message: "Logged Out Successfully"
                    }
                );
            }else{
                await userToken.remove();
                return res.status(200).json(
                    {
                        error: false,
                        message: "Logged Out Successfully"
                    }
                );
            }
        }
    }catch(err){
        console.log(err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server"
            }
        );
    }
}

export default logoutController;