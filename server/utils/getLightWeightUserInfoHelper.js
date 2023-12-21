const getLightWeightUserInfoHelper = ( user ) => {
    try{
        return {
            userId: user._id.toString(),
            userProfileImg: user.profileImg && user.profileImg.imgUrl ? user.profileImg.imgUrl : null,
            username: user.userName,
            userFullName: `${ user.identity && user.identity.firstName ? user.identity.firstName : '' } ${ user.identity && user.identity.middleName ? user.identity.middleName : '' } ${ user.identity && user.identity.lastName ? user.identity.lastName : '' }`.replaceAll( 'undefined', '' ).replaceAll( "  ", " ")
        };
    }catch( err ){
        console.log( "ERROR: user lightweight info - ", err );
        return err;
    }
}

export default getLightWeightUserInfoHelper;