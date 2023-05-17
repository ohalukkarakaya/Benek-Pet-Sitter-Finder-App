import User from "../../models/User.js";
import Log from "../../models/Log.js";

const getLogsByRequestUrlAndDatePeriodController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const { requestUrl, startDate, endDate } = req.body;
        if(
            !requestUrl
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

        // Tarihleri Date nesnesine dönüştür
        const start = new Date( startDate );
        const end = new Date( endDate );

        // Logları çek
        const regexPattern = new RegExp(`^${requestUrl}`);

        const logs = await Log.find(
                                { 
                                    $and: [
                                        { url: { $regex: regexPattern } },
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