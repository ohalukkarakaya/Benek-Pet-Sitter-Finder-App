import Log from "../../models/Log.js";
import findMatchingRouteHelper from "../../utils/findMatchingRouteHelper.js";

const getLogsByRequestUrlAndDatePeriodController = async ( req, res ) => {
    try{
        const { requestUrl, method, startDate, endDate } = req.body;
        if(
            !requestUrl
            || !method
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
        console.log("ERROR: getLogsByRequestUrlAndDatePeriodController - ", err);
        res.status( 500 )
           .json(
                {
                    error: true,
                    message: "Internal Server Error"
                }
            );
    }
}

export default getLogsByRequestUrlAndDatePeriodController;