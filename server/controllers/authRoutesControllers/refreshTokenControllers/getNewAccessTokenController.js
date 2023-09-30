import verifyRefreshToken from "../../../utils/verifyRefreshToken.js";
import { refreshTokenBodyValidation } from "../../../utils/bodyValidation/user/signUpValidationSchema.js";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const env = process.env;

const getNewAccessTokenController = async ( req, res ) => {
    try{
        const { refreshToken } = req.body;
        
        const { error } = refreshTokenBodyValidation({ refreshToken });
        if ( error ) {
            return res.status( 400 )
                    .json(
                        {
                            error: true,
                            message: error.details[ 0 ]
                                          .message
                        }
                    );
        }
        const tokenDetails = await verifyRefreshToken( refreshToken );

        if( tokenDetails.error ){
            return res.status( 400 )
                      .json(
                        {
                            error: true,
                            message: error.details[ 0 ].message
                        }
                      );
        }

        const payload = { 
                            _id: tokenDetails.tokenDetails._id, 
                            roles: tokenDetails.tokenDetails.roles ? tokenDetails.tokenDetails.roles : 0
                        };
        const accessToken = jwt.sign(
                                    payload, 
                                    env.ACCESS_TOKEN_PRIVATE_KEY, 
                                    { expiresIn: "5m" }
                                );
        
        return res.status( 200 )
                  .json(
                    {
                        error: false,
                        message: "Access token created successfully",
                        role: tokenDetails.tokenDetails.roles ? tokenDetails.tokenDetails.roles : 0,
                        accessToken,
                    }
                  );

    }catch ( err ){
        if( err.name === "TokenExpiredError" ){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "Access Denied: token expired"
                            }
                      );
        }else if( err.message === "Invalid Refresh Token" ){
            return res.status( 400 )
                      .json(
                        {
                            error: true,
                            message: err.message
                        }
                      );
        } else {
            console.log( "ERROR: getNewAccessTokenController - ", err );
            return res.status( 500 )
                      .json(
                            {
                                    error: true,
                                    message: "Internal Server Error"
                            }
                      );
        }
    }
}

export default getNewAccessTokenController;