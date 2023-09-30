import Log from "../../models/Log.js";

import findMatchingRouteHelper from "../../utils/findMatchingRouteHelper.js";

const getLogsByRequestUrlUserIdAndPeriodController = async ( req, res ) => { 
    try{
        const { requestUrl, method, searchingUserId, startDate, endDate } = req.body;
        if(
            !requestUrl
            || !method
            || !searchingUserId
            || !startDate
            || !endDate
        ){
            return res.status( 400 )
                      .json(
                        {
                            error: true,
                            message: "Missing Param"
                        }
                      );
        }

         // Tarihleri Date nesnesine dönüştür
         const start = new Date( startDate );
         const end = new Date( endDate );


        // Logları çek
        let routePath = findMatchingRouteHelper( requestUrl, method.toUpperCase() );

        const logs = await Log.find(
                                { 
                                    $and: [
                                        { url: { $regex: `^${routePath}` } },
                                        { userId: searchingUserId },
                                        {
                                            date: { 
                                                $gte: start, 
                                                $lte: end 
                                            }
                                        }
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
        console.log("ERROR: getLogsByRequestUrlUserIdAndPeriodController - ", err);
        res.status( 500 )
           .json(
                {
                    error: true,
                    message: "Internal Server Error"
                }
            );
    }
}

export default getLogsByRequestUrlUserIdAndPeriodController;