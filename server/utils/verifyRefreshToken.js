import UserToken from "../models/UserToken.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyRefreshToken = ( refreshToken ) => {
    const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;

    return new Promise((resolve, reject) => {
        UserToken.findOne(
            { token: refreshToken }, 
            (err, doc) => {
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

                jwt.verify(
                    refreshToken, 
                    privateKey, 
                    ( err, tokenDetails ) => {
                        if( err ){
                            return reject(
                                    {
                                        error: true, 
                                        message: "Invalid Refresh Token"
                                    }
                            );
                        }
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
    });
};

export default verifyRefreshToken;