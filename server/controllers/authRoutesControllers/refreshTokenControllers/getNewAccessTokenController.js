import { Worker } from "worker_threads";

const getNewAccessTokenController = async ( req, res ) => {
    try{
        const worker = new Worker( "./worker_threads/workerThreads.js" );

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

        //  workera gönder
        const { refreshToken } = req.body;
        if( !refreshToken ){
            return res.status( 400 )
                      .json(
                        {
                            error: true,
                            message: "Missing Params"
                        }
                      );
        }

        worker.postMessage(
            {
                type: "processRefreshToken",
                payload: { refreshToken }
            }
        );

    }catch( err ){
        console.log( err );
        res.status( 500 )
           .json(
               {
                    error: true,
                    message: "Internal Server Error"
               }
            );
    }
}

export default getNewAccessTokenController;