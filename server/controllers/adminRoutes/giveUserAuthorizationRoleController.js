import User from "../../models/User.js";

//  *                *         .                      *            .   *           .    *
//                                *                  *  .                .
//  *                *        .       *                ☾         *.             *.     .  *.   .
//      *           .       *                *                 .               *.        *   .
//     . giveUserAuthorizationRoleController   *       .         * .                  .  

const giveUserAuthorizationRoleController = async ( req, res ) => {
    try{
        const idOfUserBeingAuthorized = req.params.userId.toString();
        const givingRoleId = parseInt( req.params.roleId );

        if( !idOfUserBeingAuthorized || !givingRoleId ){
            return res.status( 400 )
                      .json({ error: true, message: "Missing Params" });
        }

        const authIdies = { "0": "RegularUser", "1": "SuperAmin", "2": "Developer", "3": "Editor", "4": "Accounting" };

        //// 0 - sıradan kullanıcı, 1 - super admin, 2 - developer, 3 - editor, 4 - muhasebe
        if( 
            givingRoleId !== 0 
            && givingRoleId !== 1
            && givingRoleId !== 2
            && givingRoleId !== 3
            && givingRoleId !== 4
        ){
            return res.status( 400 )
                      .json({ 
                        error: true, 
                        message: "Wrong Auth Role Id", 
                        authRoleIdies: authIdies
                      })
        }

        const userBeingAuthorized = await User.findById( idOfUserBeingAuthorized );
        if( !userBeingAuthorized ){
            return res.status( 404 )
                      .json({ error: true, message: "User Not Found" });
        }

        userBeingAuthorized.authRole = givingRoleId;
        userBeingAuthorized.markModified( "authRole" );
        await userBeingAuthorized.save();

        return res.status( 200 )
                  .json({
                    error: false,
                    message: `User with Id ${ idOfUserBeingAuthorized }, authorized as ${ authIdies[`${givingRoleId}`]}. User needs to logout and login again`
                  });
    }catch( err ){
        console.log( "ERROR: giveUserAuthorizationRoleController - ", err );
        return res.status( 500 )
                  .json({ error: true, message: "Internal Server Error" });
    }
}

export default giveUserAuthorizationRoleController;