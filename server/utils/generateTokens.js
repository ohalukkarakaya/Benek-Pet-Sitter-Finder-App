import jwt from "jsonwebtoken";
import UserToken from "../models/UserToken.js";

const generateTokens = async (user) => {
    try{
        const payload = {
            _id: user._id,
        }
        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            { expiresIn: "14m" }
        );
        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_PRIVATE_KEY,
            { expiresIn: "30d" }
        );

        const userToken = await UserToken.findOne(
            {
                userId: user_id
            }
        );
        if(userToken) await userToken.remove();

        await new UserToken(
            {
                userId: user_id, 
                token: refreshToken
            }
        ).save();
        return Promise.resolve(
            {
                accessToken,
                refreshToken
            }
        );
    }catch(err){
        return Promise.reject(err);
    }
};

export default generateTokens;