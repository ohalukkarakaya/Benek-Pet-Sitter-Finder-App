import User from "../../models/User.js";
import BannedUsers from "../../models/Report/BannedUsers.js";

// Helpers
import getLightWeightUserInfoHelper from "../../utils/getLightWeightUserInfoHelper.js";

//  *                *         .                      *            .   *           .    *
//                                *                  *  .                .
//  *                *        .       *                ☾         *.             *.     .  *.   .
//      *           .       *                *                 .               *.        *   .
//     . getBannedUsersList   *       .         * .                  .  

const getBannedUsersListController = async ( req, res ) => {
    try{
        let lastItemId = req.params.lastItemId || 'null';
        let limit = parseInt( req.params.limit ) || 15;

        bannedUserFilter = {};
        if( lastItemId !== 'null' ){
            const lastItem = await BannedUsers.findById(lastItemId);
            if(lastItem){
                bannedUserFilter.createdAt = { $gt: lastItem.createdAt };
            }
        }

        const totalBannedUserCount = await BannedUsers.countDocuments();
        let bannedUsersList = await BannedUsers.find( bannedUserFilter ).sort({ createdAt: 1 }).limit( limit ).lean();
        
        if( !bannedUsersList || bannedUsersList.length <= 0 ){
            return res.status( 404 )
                      .json({ error: false, message: "No Banned User Found"});
        }

        for( let bannedUser of bannedUsersList ){
            const bannedUserAdmin = await User.findById( bannedUser.adminId );
            if( bannedUserAdmin ){
                const bannedUserAdminInfo = getLightWeightUserInfoHelper( bannedUserAdmin );
                delete bannedUser.adminId;
                bannedUser.bannedAdmin = bannedUserAdminInfo;
            }
        }

        return res.status( 200 )
                  .json({ 
                    error: false, 
                    message: "List Prepared Succesfully", 
                    totalBannedUserCount: totalBannedUserCount, 
                    banedUserList: bannedUsersList 
                  });
    }catch( err ){
        console.log( "ERROR: getBannedUsersList - ", err );
        return res.status( 500 )
                  .json({ error: true, message: "Internal Server Error" });
    }
}

export default getBannedUsersListController;