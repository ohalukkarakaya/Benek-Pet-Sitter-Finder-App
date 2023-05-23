import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";
import getLightWeightUserInfoHelper from "../../../utils/getLightWeightUserInfoHelper.js";

const getUserByIdController = async ( req, res ) => {
    try{
        const userId = req.user
                          ._id
                          .toString();
        const searchedUserId = req.params
                                  .userId
                                  .toString();
        if( !searchedUserId ){
            return res.status( 400 )
                      .json(
                        {
                            error: true,
                            message: "Missing Params"
                        }
                      );
        }

        const searchedUser = await User.findById( searchedUserId )
                                       .lean();
        if( 
            !searchedUser 
            || searchedUser.deactivation
                           .isDeactive
            || searchedUser.blockedUsers
                           .includes( userId )
        ){
            return res.status( 404 )
                      .json(
                        {
                            error: true,
                            message: "User Not Found"
                        }
                      );
        }

        let petInfoList = [];
        for( 
            var petId 
            of searchedUser.pets 
        ){
            const pet = await Pet.findById( petId.toString() );
            const petInfo = {
                petId: petId.toString(),
                petProfileImgUrl: pet.petProfileImg
                                     .imgUrl,
                petName: pet.name
            }
            petInfoList.push( petInfo );
        }
        
        searchedUser.pets = petInfoList;

        delete searchedUser.password;
        delete searchedUser.iban;
        delete searchedUser.cardGuidies;
        delete searchedUser.trustedIps;
        delete searchedUser.blockedUsers;
        delete searchedUser.saved;
        delete searchedUser.identity.nationalId;
        delete searchedUser.identity.openAdress;
        delete searchedUser.phone;
        delete searchedUser.email;
        
        let dependedUserList = [];
        for( 
            var dependedId 
            of searchedUser.dependedUsers 
        ){
            const depended = await User.findById( dependedId );
            const dependedInfo = getLightWeightUserInfoHelper( depended );
                
            dependedUserList.push( dependedInfo );
        }
        searchedUser.dependedUsers = dependedUserList;

        const starValues = searchedUser.stars
                                       .map( 
                                            starObject => 
                                                    starObject.star 
                                        );

        const totalStarValue = starValues.reduce(
            ( acc, curr ) =>
                    acc + curr, 0
        );
        const starCount = searchedUser.stars
                                      .length;

        const starAverage = totalStarValue / starCount;

        searchedUser.totalStar = starCount;
        searchedUser.stars = starAverage;

        return res.status( 200 )
                  .json(
                      {
                          error: false,
                          message: "User Info Prepared Succesfully",
                          user: searchedUser
                      }
                  );
    }catch( err ){
        console.log( "ERROR: getUserByIdController - ", err );
        return res.status( 500 )
                  .json(
                        {
                            error: true,
                            message: "Internal server error"
                        }
                  );
    }
}

export default getUserByIdController;