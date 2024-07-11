import User from "../../models/User.js";
import PunishmentRecord from "../../models/Report/PunishmentRecord.js";

// Helpers
import sendPunishmentEmailHelper from "../../utils/adminHelpers/sendPunishmentEmailHelper.js";
import getLightWeightUserInfoHelper from "../../utils/getLightWeightUserInfoHelper.js";

//  *                *         .                      *            .   *           .    *
//                                *                  *  .                .
//  *                *        .       *                ☾         *.             *.     .  *.   .
//      *           .       *                *                 .               *.        *   .
//     . getPunishmentRecordsController   *       .         * .                  .

const getPunishmentRecordsController = async ( req, res ) => {
    try{
        const userId = req.params.userId.toString();
        if( !userId ){
            return res.status( 400 )
                .json({ error: true, message: "Missing Param" });
        }

        let punishmentRecords = [];
        const pastPunishmentRecord = await PunishmentRecord.findOne({ userId: userId }).lean();
        if( pastPunishmentRecord ){
            for( let punishmentRecord of pastPunishmentRecord.punishmentList ){
                const admin = await User.findById( punishmentRecord.adminId );

                punishmentRecord.admin = getLightWeightUserInfoHelper( admin );

                delete punishmentRecord.adminId;

                punishmentRecords.push( punishmentRecord );
            }
        }

        return res.status( 200 )
                  .json({ error: false, punishmentRecords: punishmentRecords });

    }catch( err ){
        console.log( "ERROR: getPunishmentRecordsController - ", err );
        return res.status( 500 )
            .json({ error: true, message: "Internal Server Error" });
    }
}

export default getPunishmentRecordsController;