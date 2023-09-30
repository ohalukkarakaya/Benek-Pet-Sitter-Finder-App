import Log from "../../models/Log.js";

import findMatchingRouteHelper from "../../utils/findMatchingRouteHelper.js";

const getLogsByRequestUrlAndUserIdController = async ( req, res ) => { 
    try{
        const { requestUrl, method, searchingUserId } = req.body;
        if(
            !requestUrl
            || !method
            || !searchingUserId
        ){
            return res.status( 400 )
                      .json(
                        {
                            error: true,
                            message: "Missing Param"
                        }
                      );
        }


        // Logları çek
        let routePath = findMatchingRouteHelper( requestUrl, method.toUpperCase() );

        const logs = await Log.find(
                                { 
                                    $and: [
                                        { url: { $regex: `^${routePath}` } },
                                        { userId: searchingUserId }
                                    ]
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
        console.log("ERROR: getLogsByRequestUrlAndUserIdController - ", err);
        res.status( 500 )
           .json(
                {
                    error: true,
                    message: "Internal Server Error"
                }
            );
    }
}

export default getLogsByRequestUrlAndUserIdController;