import User from "../../models/User.js";
import Log from "../../models/Log.js";

const getLogsByRequestUrlController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const skip = parseInt( req.params.skip ) || 0;
        const limit = parseInt( req.params.limit ) || 15;

        const { requestUrl } = req.body;
        if( !requestUrl ){
            return res.status( 400 )
                      .json(
                        {
                            error: true,
                            message: "Missing Param"
                        }
                      );
        }

        const user = await User.findById( userId );
        if( 
            user.authRole !== 2
            || user.authRole !== 1
        ){
            return res.status( 401 )
                      .json(
                        {
                            error: true,
                            message: "Unauthorized"
                        }
                      );
        }

        // Logları çek
        const regexPattern = new RegExp(`^${requestUrl}`);
        const logQuery = { url: { $regex: regexPattern } };
        
        const logs = await Log.find( logQuery )
                              .skip( skip )
                              .limit( limit );

        const totalLogCount = await Log.countDocuments( logQuery );

        return res.status( 200 )
                  .json(
                    {
                        error: false,
                        message: "Logs Prepared Succesfully",
                        totalLogCount: totalLogCount,
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