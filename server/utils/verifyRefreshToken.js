import UserToken from "../models/UserToken.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyRefreshToken = ( refreshToken ) => {
    try{
        const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;

        return new Promise(
            ( resolve, reject ) => {
                UserToken.findOne(
                    { token: refreshToken }, 
                    ( err, doc ) => {
                        if( err ){
                            console.log( err );
                            return reject(
                                    {
                                        error: true, 
                                        message: "Internal server error"
                                    }
                            );
                        }

                        if( !doc ){
                            return reject(
                                    {
                                        error: true, 
                                        message: "Invalid Refresh Token"
                                    }
                            );
                        }

                        const tokenDetails = jwt.verify(
                                                refreshToken, 
                                                privateKey
                                             );
                        resolve(
                            {
                                tokenDetails,
                                error: false,
                                message: "Valid Refresh Token"
                            }
                        );
                    }
                );
            }
        );
    }catch( err ){
        if( err.name === 'TokenExpiredError' ) {
            // Token süresi dolmuşsa 
            return {
                        error: true,
                        message: "Access Denied: token expired"
                   }
          } else {
            // Diğer hatalar
            return {
                        error: true,
                        message: "Access Denied: No token provided"
                   }
          }
    }
};

export default verifyRefreshToken;