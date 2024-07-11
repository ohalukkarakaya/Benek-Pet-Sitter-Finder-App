import User from "../../models/User.js";
import PunishmentRecord from "../../models/Report/PunishmentRecord.js";

// Helpers
import sendPunishmentEmailHelper from "../../utils/adminHelpers/sendPunishmentEmailHelper.js";
import getLightWeightUserInfoHelper from "../../utils/getLightWeightUserInfoHelper.js";

//  *                *         .                      *            .   *           .    *
//                                *                  *  .                .
//  *                *        .       *                ☾         *.             *.     .  *.   .
//      *           .       *                *                 .               *.        *   .
//     . getPunishmentCountController   *       .         * .                  .

const getPunishmentCountController = async ( req, res ) => {
    try{
        const userId = req.params.userId.toString();
        if( !userId ){
            return res.status( 400 )
                .json({ error: true, message: "Missing Param" });
        }

        let punishmentCount = 0;
        const pastPunishmentRecord = await PunishmentRecord.findOne({ userId: userId });
        if( pastPunishmentRecord ){
            //if user already have a punishment record
            punishmentCount = pastPunishmentRecord.punishmentList.length;
        }

        return res.status( 200 )
            .json({ error: false, punishmentCount: punishmentCount });

    }catch( err ){
        console.log( "ERROR: getPunishmentCountController - ", err );
        return res.status( 500 )
            .json({ error: true, message: "Internal Server Error" });
    }
}

export default getPunishmentCountController;