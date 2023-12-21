import Log from "../../models/Log.js";

const getErrorLogsController = async ( req, res ) => {
    try{
        const logs = await Log.find({ "status": { $ne: 200 } });
        if( !logs ){
            return res.status( 404 )
                      .json({ error: true, message: "Logs Not Found" });
        }
        return res.status( 200 )
                  .json(
                    { 
                        error: false, 
                        message: "Logs Prepared Succesfully",
                        logCount: logs.length,
                        logs 
                    }
                  );
    }catch( err ){
        console.log( "ERROR: getErrorLogsController - ", err );
        return res.status( 500 )
                  .json({ error: true, message: "Internal Server Error" });
    }
}

export default getErrorLogsController;