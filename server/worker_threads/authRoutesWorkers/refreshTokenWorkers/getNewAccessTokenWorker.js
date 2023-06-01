import verifyRefreshToken from "../../../utils/verifyRefreshToken.js";
import { refreshTokenBodyValidation } from "../../../utils/bodyValidation/user/signUpValidationSchema.js";

import { parentPort } from 'worker_threads';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const env = process.env;

const getNewAccessTokenWorker = async ( message ) => {
    const { refreshToken } = message.payload;
        
    const { error } = refreshTokenBodyValidation({ refreshToken });
    if ( error ) {
        parentPort.postMessage(
            {
                type: "error",
                payload: {
                    error: true,
                    message: error.details[ 0 ]
                                  .message
                }
            }
        );
        return;
    }
        
    try {
        const tokenDetails = await verifyRefreshToken( refreshToken );

        if( tokenDetails.error ){
            parentPort.postMessage(
                {
                    type: "error",
                    payload: {
                        error: true,
                        message: error.details[ 0 ]
                                      .message
                    }
                }
            );
            return;
        }

        const payload = { 
                            _id: tokenDetails._id, 
                            roles: tokenDetails.roles 
                        };
        const accessToken = jwt.sign(
                                    payload, 
                                    env.ACCESS_TOKEN_PRIVATE_KEY, 
                                    { expiresIn: "5m" }
                                );
            
        parentPort.postMessage(
            {
                type: "success",
                payload: {
                    error: false,
                    accessToken,
                    message: "Access token created successfully"
                }
            }
        );
    }catch ( err ){
        if( err.name === "TokenExpiredError" ){
            parentPort.postMessage(
                {
                    type: "error",
                    payload: {
                        error: true,
                        message: "Access Denied: token expired"
                    }
                }
            );
        }else{
            parentPort.postMessage(
                {
                    type: "error",
                    payload: err
                }
            );
        }
    }
};

export default getNewAccessTokenWorker;