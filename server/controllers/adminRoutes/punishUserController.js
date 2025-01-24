import User from "../../models/User.js";
import PunishmentRecord from "../../models/Report/PunishmentRecord.js";

// Helpers
import sendPunishmentEmailHelper from "../../utils/adminHelpers/sendPunishmentEmailHelper.js";
import getLightWeightUserInfoHelper from "../../utils/getLightWeightUserInfoHelper.js";
import BannedUsers from "../../models/Report/BannedUsers.js";
import sendBanEmailHelper from "../../utils/adminHelpers/sendBanEmailHelper.js";
import canDeleteUser from "../../utils/adminHelpers/canDeleteUserHelper.js";
import BanUserASAPRecord from "../../models/Report/BanUserASAPRecord.js";

//  *                *         .                      *            .   *           .    *
//                                *                  *  .                .
//  *                *        .       *                ☾         *.             *.     .  *.   .
//      *           .       *                *                 .               *.        *   .
//     . punishUserController   *       .         * .                  .  

const punishUserController = async ( req, res ) => {
    try{
        const punishingUserId = req.params.userId.toString();
        const punishmentDesc = req.body.punishmentDesc.toString();
        if( !punishingUserId || !punishmentDesc ){
            return res.status( 400 )
                      .json({ error: true, message: "Missing Param" });
        }

        // insert punishment
        const newPunishment = {
            adminId: req.user._id.toString(),
            adminDesc: punishmentDesc
        }

        let totalPunishment = 1;
        const pastPunishmentRecord = await PunishmentRecord.findOne({ userId: punishingUserId });
        if( pastPunishmentRecord ){
            //if user already have a punishment record
            pastPunishmentRecord.punishmentList.push( newPunishment );
            pastPunishmentRecord.markModified( "punishmentList" );

            totalPunishment = pastPunishmentRecord.punishmentList.length;

            pastPunishmentRecord.save();
        }else{
            //create new punishment
            await new PunishmentRecord({ userId: punishingUserId, punishmentList: [ newPunishment ] }).save();
        }

        // send notification email to let user know
        const punishingUser = await User.findById( punishingUserId );
        const isUserDeletable = await canDeleteUser( punishingUserId );

        if( totalPunishment >= 3 ){
            if(!isUserDeletable){
                let pastBanRequestRecord = await BanUserASAPRecord.findOne({ userId: punishingUserId });

                if( !pastBanRequestRecord ) {
                    await new BanUserASAPRecord({
                        adminId: req.user._id.toString(),
                        userId: punishingUserId,
                        banReason: "User Banned Because Of Over Punishment Record"
                    }).save();
                }
                return res.status(200)
                    .json({error: false, message: "User Punished Succesfully"});
            }

            punishingUser.deactivation.isDeactive = true;
            punishingUser.deactivation.isAboutToDelete = true;
            punishingUser.deactivation.deactivationDate = Date.now();

            const punishedUserInfo = getLightWeightUserInfoHelper( punishingUser );
            await new BannedUsers(
                {
                    adminId: req.user._id.toString(),
                    userEmail: punishingUser.email,
                    userPhoneNumber: punishingUser.phone,
                    userFullName: punishedUserInfo.userFullName,
                    adminDesc: "User Banned Because Of Over Punishment Record"
                }
            ).save();

            await sendBanEmailHelper( punishingUser.email, "Son 45 gün içerisinde 3'ten fazla ceza puanı aldığınız için hesabınız kalıcı olarak silinmiş ve kara listeye alınmıştır!" );

            punishingUser.markModified( "deactivation" );
            await punishingUser.save();
        }

        if( punishingUser && !( punishingUser.deactivation.isDeactive )){
            await sendPunishmentEmailHelper( punishingUser.email, punishmentDesc );
        }

        return res.status( 200 )
                  .json({ error: false, message: "User Punished Succesfully" })

    }catch( err ){
        console.log( "ERROR: punishUserController - ", err );
        return res.status( 500 )
                  .json({ error: true, message: "Internal Server Error" });
    }
}

export default punishUserController;