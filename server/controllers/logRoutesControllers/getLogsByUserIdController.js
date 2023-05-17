import User from "../../models/User.js";
import Log from "../../models/Log.js";

const getLogsByUserIdController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const { searchingUser } = req.params;
        if( !searchingUser ){
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

        // Kullanıcıya ait logları çek
        const logs = await Log.find(
                                    { 
                                        searchingUser 
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