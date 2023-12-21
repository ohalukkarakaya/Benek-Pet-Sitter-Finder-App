import Log from "../../models/Log.js";

const getLogsByStatusCodeController = async ( req, res ) => {
    try{
        const statusCode = parseInt( req.params.statusCode );
        if( !statusCode ){
            return res.status( 400 )
                      .json({ error: true, message: "Missing Params" });
        }

        const logs = await Log.find({ "status": statusCode });
        if( !logs ){
            return res.status( 404 )
                      .json({ error: true, message: "Logs Not Found" });
        }

        return res.status( 200 )
                  .json({ 
                    error: false, 
                    message: "Logs Prepared Succesfully",
                    logCount: logs.length,
                    logs 
                  });
    }catch( err ){
        console.log( "ERROR: getLogsByStatusCodeController - ", err );
        return res.status( 500 )
                  .json({ error: true, message: "Internal Server Error" });
    }
}

export default getLogsByStatusCodeController;