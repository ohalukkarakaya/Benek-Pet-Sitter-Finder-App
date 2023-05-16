import User from "../../../models/User.js";

const blockUserController = async ( req, res ) => {
    try{

        const userId = req.user._id.toString();
        const blockingUserId = req.params.userId.tostring();
        if( !blockingUserId ){
            return res.status( 400 )
                      .json(
                          {
                              error: true,
                              message: "missing params"
                          }
                      );
        }

        const user = await User.findById( userId );
        const blockingUser = await User.findById( blockingUserId );
        if(
            !blockingUser 
            || blockingUser.isDeactive 
            || blockingUser.blockedUsers.includes( userId )
        ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "user not found"
                }
            );
        }

        if( 
            user.blockedUsers
                .includes( blockingUserId ) 
        ){
            return res.status( 400 )
                      .json(
                          {
                              error: true,
                              message: "User already blocked"
                          }
                      );
        }

        user.blockedUsers.push( blockingUserId );
        user.markModified.apply( "blockedUsers" );
        user.save(
            function (err) {
                if(err) {
                    console.error('ERROR: While Update!');
                }
            }
        );

        return res.status( 200 )
                  .json(
                      {
                          error: false,
                          message: "User blocked succesfully"
                      }
                  );

    }catch( err ){
        console.log("Error: block user", err);
        return res.status( 500 )
                  .json(
                        {
                            error: true,
                            message: "Internal server error"
                        }
                   );
    }
}

export default blockUserController;