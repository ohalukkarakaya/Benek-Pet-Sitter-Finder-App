import User from "../../models/User.js";

//  *                *         .                      *            .   *           .    *
//                                *                  *  .                .
//  *                *        .       *                ☾         *.             *.     .  *.   .
//      *           .       *                *                 .               *.        *   .
//     . getActiveUserCountController   *       .         * .                  .  

const getActiveUserCountController = async ( req, res ) => {
    try{
        const activeUserQuery = { "deactivation.isDeactive": false };
        const activeUserCount = await User.find( activeUserQuery );

        return res.status( 200 )
                  .json({
                    error: false,
                    message: "Active Users Counted Succesfully",
                    activeUserCount: activeUserCount
                  });
    }catch( err ){
        console.log( "ERROR: getActiveUserCountController - ", err );
        return res.status( 500 )
                  .json({ error: true, message: "Internal Server Error" });
    }
}

export default getActiveUserCountController;