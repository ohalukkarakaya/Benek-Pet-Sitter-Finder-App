import Log from "../../models/Log.js";

const getLogsByUserIdController = async ( req, res ) => {
    try{
        const searchingUser = req.params.userId;
        if( !searchingUser ){
            return res.status( 400 )
                      .json(
                        {
                            error: true,
                            message: "Missing Param"
                        }
                      );
        }

        // Kullanıcıya ait logları çek
        const logs = await Log.find(
                                    { 
                                        userId: searchingUser 
                                    }
                               );

        return res.status( 200 )
                  .json(
                    {
                        error: false,
                        message: "Logs Prepared Succesfully",
                        logs: logs
                    }
                  );
    }catch( err ){
        console.log("ERROR: getLogsByUserIdController - ", err);
        res.status( 500 )
           .json(
                {
                    error: true,
                    message: "Internal Server Error"
                }
            );
    }
}

export default getLogsByUserIdController;