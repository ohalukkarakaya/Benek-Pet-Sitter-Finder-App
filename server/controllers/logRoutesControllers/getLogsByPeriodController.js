import User from "../../models/User.js";
import Log from "../../models/Log.js";

const getLogsByPeriodController = async( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const { startDate, endDate } = req.query;
        if(
            !startDate
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
        const logs = await Log.find(
                                { 
                                    date: { 
                                            $gte: start, 
                                            $lte: end 
                                        } 
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
        console.log("ERROR: getLogsByPeriodController - ", err);
        res.status( 500 )
           .json(
                {
                    error: true,
                    message: "Internal Server Error"
                }
            );
    }
}

export default getLogsByPeriodController;