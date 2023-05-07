import Pet from "../../../models/Pet.js";
import User from "../../../models/User.js";

const followPetController = async (req, res) => {
    try{
        const petId = req.params.petId.toString();
        if(!petId){
            return res.status(400).json(
                {
                    error: true,
                    message: "pet id parameter is required"
                }
            );
        }

        const user = await User.findById( req.user._id );
        if(
            !user 
            || user.deactivation.isDeactive
        ){
            return res.status(404).json(
                {
                    error: true,
                    message: "user couldn't found"
                }
            );
        }

        const pet = await Pet.findById( petId );
        const petOwner = await User.findById( pet.primaryOwner.toString() );

        if( 
            !pet
            || !petOwner
            || petOwner.blockedUsers.includes( req.user._id.toString() )
            || petOwner.deactivation.isDeactive
        ){
            return res.status(404).json(
                {
                    error: true,
                    message: "pet couldn't found"
                }
            );
        }
        
        const isAlreadyFollowedUserSide = user.followingUsersOrPets.find(
            followingIdObject =>
                followingIdObject.type === "pet"
                && followingIdObject.followingId.toString() === petId
        );

        const isAlreadyFollowedPetSide = pet.followers.find(
            followerId =>
                followerId.toString() === req.user._id.toString()
        );

        if(
            !isAlreadyFollowedUserSide && isAlreadyFollowedPetSide
            || isAlreadyFollowedUserSide && !isAlreadyFollowedPetSide
        ){
            user.followingUsersOrPets = user.followingUsersOrPets.filter(
                followingIdObject =>
                    followingIdObject.followingId.toString() !== petId
            );
            user.markModified("followingUsersOrPets");
            user.save(
                (err) => {
                    if(err) {
                        console.error('ERROR: While fixing follow issue!');
                        return res. status(500).json(
                            {
                                error: true,
                                message: 'ERROR: While fixing follow issue - user side!'
                            }
                        );
                    }
                }
            );

            pet.followers = pet.followers.filter(
                followerId =>
                    followerId.toString() !== req.user._id.toString()
            );
            pet.markModified("followers");
            pet.save(
                (err) => {
                    if(err) {
                        console.error('ERROR: While fixing follow issue!');
                        return res. status(500).json(
                            {
                                error: true,
                                message: 'ERROR: While fixing follow issue - pet side!'
                            }
                        );
                    }
                }
            );

            return res.status(500).json(
                {
                    error: true,
                    message: "pet unfollowed because there was an issue with records. Please re try to follow"
                }
            );
        }

        const isAlreadyFollowed = isAlreadyFollowedUserSide && isAlreadyFollowedPetSide;

        if(isAlreadyFollowed){
            user.followingUsersOrPets = user.followingUsersOrPets.filter(
                followingIdObject =>
                    followingIdObject.followingId.toString() !== petId
            );

            pet.followers = pet.followers.filter(
                followerId =>
                    followerId.toString() !== req.user._id.toString()
            );
        }else{
            user.followingUsersOrPets.push( 
                {
                    type: "pet",
                    followingId: petId
                }
            );
            
            pet.followers.push( req.user._id.toString() );
        }

        user.markModified("followingUsersOrPets");
        user.save(
            (err) => {
                if(err){
                    console.error('ERROR: While following pet - user side!');
                    return res.status(500).json(
                        {
                            error: true,
                            message: 'ERROR: While following pet - user side!'
                        }
                    );
                }
            }
        );

        pet.markModified("followers");
        pet.save(
            (err) => {
                if(err){
                    console.error('ERROR: While following pet - pet side!');
                    return res.status(500).json(
                        {
                            error: true,
                            message: 'ERROR: While following pet - pet side!'
                        }
                    );
                }
            }
        );

        return res.status(200).json(
            {
                error: false,
                message: "pet followed or follow event removed succesfully"
            }
        );
    }catch(err){
        console.log("error - follow pet", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default followPetController;