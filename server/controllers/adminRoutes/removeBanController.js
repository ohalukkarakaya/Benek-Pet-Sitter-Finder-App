import BannedUsers from "../../models/Report/BannedUsers.js";

//  *                *         .                      *            .   *           .    *
//                                *                  *  .                .
//  *                *        .       *                ☾         *.             *.     .  *.   .
//      *           .       *                *                 .               *.        *   .
//     . removeBanController   *       .         * .                  .  

const removeBanController = async ( req, res ) => {
    try{
        const banId = req.params.banId.toString();
        if( !banId ){
            return res.status( 400 )
                      .jaon({
                        error: true,
                        message: "Missing Params"
                      })
        }

        const banRecord = await BannedUsers.findById( banId );
        if( !banRecord ){
            return res.status( 404 )
                      .json({ error: true, message: "Ban Record Not Found" });
        }

        await banRecord.deleteOne();
        return res.status( 200 )
                  .json({ error: false, message: "Ban Removed Succesfully" });
    }catch( err ){
        console.log( "ERROR: removeBanController - ", err );
        return res.status( 500 )
                  .json({ error: true, message: "Internal Server Error" });
    }
}

export default removeBanController;