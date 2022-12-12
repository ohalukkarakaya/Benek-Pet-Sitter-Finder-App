import { Router } from "express";
import UserToken from "../../models/UserToken.js";
import jwt from "jsonwebtoken";
import verifyRefreshToken from "../../utils/verifyRefreshToken.js";
import { refreshTokenBodyValidation } from "../../utils/bodyValidation/user/signUpValidationSchema.js";

const router = Router();

// Get new access token
router.post("/", async (req, res) => {
    const { error } = refreshTokenBodyValidation(req.body);
    if(error){
        return res.status(400).json(
            {
                error: true,
                message: error.details[0].message
            }
        );
    }else{
        verifyRefreshToken(req.body.refreshToken).then(
            ({ tokenDetails }) => {
                const payload = {_id: tokenDetails._id, roles: tokenDetails.roles};
                const accessToken = jwt.sign(
                    payload,
                    process.env.ACCESS_TOKEN_PRIVATE_KEY,
                    { expiresIn: "14m" }
                );
                res.status(200).json(
                    {
                        error: false,
                        accessToken,
                        message: "Access token created successfully"
                    }
                );
            }
        ).catch(
            (err) => res.status(400).json(err)
        );
    }
});

// Logout
router.delete("/", async (req, res) => {
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
});

export default router;