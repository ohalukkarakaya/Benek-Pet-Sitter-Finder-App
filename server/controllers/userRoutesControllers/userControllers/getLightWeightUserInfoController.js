import User from "../../../models/User.js";

const getLightWeightUserInfoController = async ( req, res ) => {
    try{
        const sendedUserIdList = req.body.userIdList;
        if( !userIdList ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "Missing Params"
                }
            );
        }

        const userIdList = [...new Set( sendedUserIdList )];
        userIdList.forEach(
            async ( userId ) => {
                const user = await User.findById( userId );
                if( !user ){
                  userId.remove();  
                }else{
                    const userrInfo = {
                    
                        userId: likedUser._id
                                         .toString(),
                        userProfileImg: likedUser.profileImg
                                                 .imgUrl,
                        username: likedUser.userName,
                        userFullName: `${
                                likedUser.identity
                                         .firstName
                            } ${
                                likedUser.identity
                                         .middleName
                            } ${
                                likedUser.identity
                                         .lastName
                            }`.replaceAll( "  ", " ")
                    }

                    userId = userrInfo;
                }
            }
        );

        return res.status( 200 ).json(
            {
                error: false,
                message: "User info prepared succesfully",
                userList: userIdList
            }
        );
    }catch( err ){
        console.log( "ERROR: getLightWeightUserInfoController - ", err );
        return res.status( 500 ).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default getLightWeightUserInfoController;