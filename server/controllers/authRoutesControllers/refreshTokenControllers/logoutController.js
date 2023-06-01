import { Worker } from "worker_threads";
import { refreshTokenBodyValidation } from "../../../utils/bodyValidation/user/signUpValidationSchema.js";

const logoutController = async ( req, res ) => {
    try{
        const worker = new Worker( "./worker_threads/workerThreads.js" );

        const { error } = refreshTokenBodyValidation( req.body );
        if( error ){
            return res.status( 400 )
                      .json(
                           {
                               error: true,
                               message: error.details[ 0 ]
                                             .message
                           }
                       );
        }

        const { refreshToken } = req.body;

        // cevap döndüğünde
        worker.on(
            "message", 
            ( message ) => {
            if( 
                message.type === "success" 
            ){
              res.status( 200 )
                 .json( 
                    message.payload 
                  );
            }else if( 
                message.type === "error" 
            ){
              res.status( 400 )
                 .json( 
                    message.payload 
                 );
            }
          }
        );

        worker.postMessage(
                            { 
                                type: "processLogout",
                                payload: { refreshToken } 
                            }
               );

    }catch( err ){
        console.log( err );
        return res.status( 500 )
                  .json(
                       {
                           error: true,
                           message: "Internal Server"
                       }
                   );
    }
}

export default logoutController;