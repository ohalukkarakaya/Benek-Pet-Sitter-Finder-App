import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";
import getLightWeightUserInfoHelper from "../../../utils/getLightWeightUserInfoHelper.js";

const getPetByIdController = async ( req, res ) => {
    try{
        const petId = req.params.petId.toString();
        if( !petId ){
            return res.status( 400 ).json({
                error: true,
                message: "Missing Params"
            });
        }

        const pet = await Pet.findById( petId ).lean();

        const owner = await User.findById( pet.primaryOwner.toString() );

        if( 
            !pet
            || !owner
            || owner.deactivation.isDeactive
            || owner.blockedUsers.includes( req.user._id.toString() )
        ){
            return res.status( 404 ).json({
                error: true,
                message: "Pet not found"
            });
        }

        const primaryOwnerInfo = getLightWeightUserInfoHelper( owner );

        pet.primaryOwner = primaryOwnerInfo;

        pet.allOwnerInfoList = [];
        for( let ownerId of pet.allOwners ){
            const secondaryOwner = await User.findById( ownerId.toString() );                      
            const secondaryOwnerInfo = getLightWeightUserInfoHelper( secondaryOwner );
                
            pet.allOwnerInfoList.push( secondaryOwnerInfo );
        };

        if(  pet.allOwnerInfoList.length === pet.allOwners.length ){
            delete pet.allOwners
        }

        for( let image of pet.images ){
            image = image.imgUrl
        };

        return res.status( 200 ).json({
            error: false,
            message: "Pet found succesfully",
            pet: pet
        });

    }catch( err ){
        console.log("ERROR: getPetByIdController - ", err);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
}

export default getPetByIdController;