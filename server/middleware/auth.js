import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const auth = async (req, res, next) => {
    const token = req.header("x-access-token");
    if(!token){
        return res.status(403).json(
            {
                error: true,
                message: "Access Denied: No token provided"
            }
        );
    }else{
        try{
            const tokenDetails = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_PRIVATE_KEY
            );
            req.user = tokenDetails;
            next();
        }catch(err){
            return res.status(403).json(
                {
                    error: true,
                    message: "Access Denied: No token provided"
                }
            );
        }
    }
};

export default auth;