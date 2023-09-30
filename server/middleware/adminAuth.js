import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const adminAuth = async (req, res, next) => {
    try{
        const token = req.header("x-access-token");
        if( !token ){
            return res.status( 403 )
                    .json(
                        {
                            error: true,
                            message: "Access Denied: No token provided"
                        }
                    );
        }
        const user = jwt.verify( token, process.env.ACCESS_TOKEN_PRIVATE_KEY );
        if( user.roles !== 1 && user.roles !== 2 ){
            return res.status( 401 )
                      .json(
                        {
                            error: true,
                            message: "UnAuthorized"
                        }
                      );
        }
        req.user = user;
        next();
    }catch( err ){
        if( err.name === 'TokenExpiredError' ) {
            // Token süresi dolmuşsa 
            return res.status( 403 )
                      .json(
                          {
                             error: true,
                             message: "Access Denied: token expired"
                          }
                       );
          } else {
            // Diğer hatalar
            return res.status( 403 )
                      .json(
                              {
                                error: true,
                                message: "Access Denied: No token provided"
                              }
                      );
          }
    }
};

export default adminAuth;