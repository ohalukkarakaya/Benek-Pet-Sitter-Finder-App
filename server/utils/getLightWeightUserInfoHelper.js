const getLightWeightUserInfoHelper = ( user ) => {
    try{
        return {
            userId: user._id.toString(),
            userProfileImg: user.profileImg.imgUrl,
            username: user.userName,
            userFullName: `${
                user.identity
                    .firstName 
            } ${ 
                user.identity
                    .middleName 
            } ${ 
               user.identity
                   .lastName 
            }`.replaceAll( 'undefined', '' )
              .replaceAll( "  ", " ")
        };
    }catch( err ){
        console.log( "ERROR: user lightweight info - ", err );
        return err;
    }
}

export default getLightWeightUserInfoHelper;