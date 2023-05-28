import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";

import getLightWeightPetInfoHelper from "../../getLightWeightPetInfoHelper.js";
import getLightWeightUserInfoHelper from "../../getLightWeightUserInfoHelper.js";

const preparePetHandOverInvitationDataHelper = async ( invitation ) => {
    try{
        const primaryOwner = await User.findById( 
                                            invitation.from
                                                    .toString() 
                                        );

        if( !primaryOwner ){
            return {
                error: true,
                message: "user not found"
            }
        }

        const primaryOwnerInfo = getLightWeightUserInfoHelper( primaryOwner );

        invitation.from = primaryOwnerInfo;

        const pet = await Pet.findById( invitation.petId.toString() );

        if( !pet ){
            return {
                error: true,
                message: "Pet not found"
            }
        }

        const petInfo = getLightWeightPetInfoHelper( pet );

        invitation.pet = petInfo;
        delete invitation.petId;

        invitation.type = "PetHandOverInvitation";

        return {
            error: false,
            data: invitation
        }
    }catch( err ){
        console.log( "ERROR: preparePetHandOverInvitationDataHelper - ", err );
        return {
            error: true,
            message: "Internal Server Error"
        }
    }
}

export default preparePetHandOverInvitationDataHelper;