//                                          88             88  88                      88  88                         88
//                                                                                                                    88
//  dP""b8    db    88     88 .dP"Y8      dP"Yb  Yb    dP 88   88 88b 88       dP""b8 88   88 Yb    dP 888888 88b 88  88
// dP   `"   dPYb   88     88 `Ybo."     dP   Yb  Yb  dP  88   88 88Yb88      dP   `" 88   88  Yb  dP  88__   88Yb88  88
// Yb       dP__Yb  88  .o 88 o.`Y8b     Yb   dP   YbdP   Y8   8P 88 Y88      Yb  "88 Y8   8P   YbdP   88""   88 Y88   
//  YboodP dP""""Yb 88ood8 88 8bodP' dp   YbodP     YP    `YbodP' 88  Y8 db    YboodP `YbodP'    YP    888888 88  Y8  88
//                                   d                                   d
//    88                       88



import { Router } from "express";
import UserToken from "../../models/UserToken.js";
import jwt from "jsonwebtoken";
import verifyRefreshToken from "../../utils/verifyRefreshToken.js";
import { refreshTokenBodyValidation } from "../../utils/signUpValidationSchema.js";

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