import User from "../../../models/User.js";

const unblockUserController = async ( req, res ) => {
    try{
        
        const userId = req.user._id.toString();
        const unblockingUserId = req.params.userId.tostring();
        if( !unblockingUserId ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "missing params"
                }
            );
        }

        const user = await User.findById( userId );
        const unblockingUser = await User.findById( unblockingUserId );
        if(
            !unblockingUser 
            || unblockingUser.isDeactive 
        ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "user not found"
                }
            );
        }

        if( 
            !(
                user.blockedUsers
                    .includes( unblockingUserId ) 
            )
        ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "User is not blocked"
                }
            );
        }

        user.blockedUsers = user.blockedUsers.filter(
            blockedUser =>
                blockedUser.toString() === unblockingUserId
        );
        user.markModified.apply( "blockedUsers" );
        user.save(
            function (err) {
                if(err) {
                    console.error('ERROR: While Update!');
                }
            }
        );

        return res.status( 200 ).json(
            {
                error: false,
                message: "User unblocked succesfully"
            }
        );
    }catch( err ){
        console.log("Error: unblock user", err);
        return res.status(500).json(
          {
            error: true,
            message: "Internal server error"
          }
        );
    }
}

export default unblockUserController;