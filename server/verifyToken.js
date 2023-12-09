import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
    try{
        const token = req.cookies.access_token;
        console.log( token );
        if( !token )
            return next(
                        createError(
                                401, 
                                "You are not authenticated"
                        )
                   );

        const user = jwt.verify(
                            token, 
                            process.env
                                   .JWT,
                        );
        req.user = user;
        
        next();
    }catch( err ){
        if (err.name === 'TokenExpiredError') {
            // Token süresi dolmuşsa
            return res.status( 403 )
                  .json(
                        {
                            error: true,
                            message: "Access Denied: Token Expired"
                        }
                   );
          } else {
            // Diğer hatalar için
            return res.status( 403 )
                  .json(
                        {
                            error: true,
                            message: "Access Denied: Invalid Token"
                        }
                   );
          }
    }
}