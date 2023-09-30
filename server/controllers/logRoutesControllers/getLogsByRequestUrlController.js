import Log from "../../models/Log.js";
import findMatchingRouteHelper from "../../utils/findMatchingRouteHelper.js";

const getLogsByRequestUrlController = async ( req, res ) => {
    try{
        const { requestUrl, method } = req.body;
        if( !requestUrl ){
            return res.status( 400 )
                      .json(
                        {
                            error: true,
                            message: "Missing Param"
                        }
                      );
        }

        let routePath = findMatchingRouteHelper( requestUrl, method.toUpperCase() );
        // Logları çek
        const logQuery = { url: { $regex: `^${routePath}` } };
        const logs = await Log.find( logQuery );

        return res.status( 200 )
                  .json(
                    {
                        error: false,
                        message: "Logs Prepared Succesfully",
                        logs: logs
                    }
                  );
    }catch( err ){
        console.log("ERROR: getLogsByRequestUrlController - ", err);
        res.status( 500 )
           .json(
                {
                    error: true,
                    message: "Internal Server Error"
                }
            );
    }
}

export default getLogsByRequestUrlController;