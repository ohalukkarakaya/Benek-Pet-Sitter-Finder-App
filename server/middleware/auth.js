import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const auth = async (req, res, next) => {
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
        const user = jwt.verify(
                             token, 
                             process.env
                                    .ACCESS_TOKEN_PRIVATE_KEY
                         );
        req.user = user;
        next();
    }catch( err ){
        if( err.name === 'TokenExpiredError' ) {
            // Token süresi dolmuşsa burada işlemlerinizi yapabilirsiniz
            return res.status( 403 )
                      .json(
                          {
                             error: true,
                             message: "Access Denied: token expired"
                          }
                       );
          } else {
            // Diğer hatalar için burada işlemlerinizi yapabilirsiniz
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

export default auth;