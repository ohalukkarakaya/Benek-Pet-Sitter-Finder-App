import User from "../../models/User.js";
import BannedUsers from "../../models/Report/BannedUsers.js";

// Helpers
import sendBanEmailHelper from "../../utils/adminHelpers/sendBanEmailHelper.js";
import getLightWeightUserInfoHelper from "../../utils/getLightWeightUserInfoHelper.js";

//  *                *         .                      *            .   *           .    *
//                                *                  *  .                .
//  *                *        .       *                ☾         *.             *.     .  *.   .
//      *           .       *                *                 .               *.        *   .
//     . banUserController   *       .         * .                  .  

const banUserController = async ( req, res ) => {
    try{
        const baningUserId = req.params.userId.toString();
        const banDesc = req.body.punishmentDesc.toString();
        if( !baningUserId || !banDesc ){
            return res.status( 400 )
                      .json({ error: true, message: "Missing Param" });
        }

        const baningUser = await User.findById( baningUserId );
        if( !baningUser ){
            return res.status( 404 )
                      .json({ error: true, message: "User not found" });
        }

        const isUserAlreadyBanned = await BannedUsers.findOne({ userEmail: baningUser.email });
        if( !isUserAlreadyBanned ){
            const baningUserInfo = getLightWeightUserInfoHelper( baningUser );
            await new BannedUsers(
                { 
                    adminId: req.user._id.toString(), 
                    userEmail: baningUser.email, 
                    userPhoneNumber: baningUser.phone, 
                    userFullName: baningUserInfo.userFullName, 
                    adminDesc: banDesc.toString() 
                }
            ).save();
        }

        const banEmail = await sendBanEmailHelper( baningUser.email.toString(), banDesc.toString() );
        if( !banEmail || banEmail.error ){
            return res.status( 500 )
                      .json({ error: true, message: "Error Occured While Sending Email"})
        }

        baningUser.deactivation.isDeactive = true;
        baningUser.deactivation.deactivationDate = Date.now();
        baningUser.deactivation.isAboutToDelete = true;

        baningUser.markModified( "deactivation" );
        await baningUser.save();
        
        return res.status( 200 )
                  .json({
                    error: false,
                    message: "User Baned Succesfully"
                  });
    }catch( err ){
        console.log( "ERROR: punishUserController - ", err );
        return res.status( 500 )
                  .json({ error: true, message: "Internal Server Error" });
    }
}

export default banUserController;