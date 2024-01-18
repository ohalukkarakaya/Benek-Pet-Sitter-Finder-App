import User from "../../../models/User.js";

const getLightWeightUserInfoController = async ( req, res ) => {
    try{
        const sendedUserIdList = req.body
                                    .userIdList;
        if( !sendedUserIdList ){
            return res.status( 400 )
                      .json(
                          {
                              error: true,
                              message: "Missing Params"
                          }
                      );
        }

        const userIdList = [...new Set( sendedUserIdList )].map( String );
        let updatedUserIdList = [];

        for( let userId of userIdList ){

            const user = await User.findById( userId );

            if( !user ){
                continue;
            }

            const userInfo = {
                userId: user._id.toString(),
                isProfileImageDefault: user.profileImg.isDefaultImg,
                userProfileImg: user.profileImg.imgUrl,
                username: user.userName,
                userFullName: `${ user.identity.firstName } ${ user.identity.middleName } ${ user.identity.lastName }`.replaceAll("undefined", "").replaceAll("  ", " "),
            };

            updatedUserIdList.push( userInfo );
        }

        return res.status( 200 )
                  .json(
                      {
                          error: false,
                          message: "User info prepared succesfully",
                          userList: updatedUserIdList
                      }
                  );
    }catch( err ){
        console.log( "ERROR: getLightWeightUserInfoController - ", err );
        return res.status( 500 )
                  .json(
                        {
                            error: true,
                            message: "Internal server error"
                        }
                  );
    }
}

export default getLightWeightUserInfoController;