import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";

import getLightWeightUserInfoHelper from "../../getLightWeightUserInfoHelper.js";
import getLightWeightPetInfoHelper from "../../getLightWeightPetInfoHelper.js";

const prepareCareGiveInvitationDataHelper = async ( invitation ) => {
    try{
        const invitationOfCareGive = invitation.invitation;
        const sender = await User.findById( 
                                        invitation.from
                                                .toString() 
                                  );

        if( !sender ){
            return {
                error: true,
                message: "User Not Found"
            }
        }

        const senderInfo = getLightWeightUserInfoHelper( sender );

        invitation.from = senderInfo;

        const price = invitation.prices.priceType !== "Free" 
                            ? `${ invitation.prices.servicePrice } ${ invitation.prices.priceType }`
                            : `${ invitation.prices.priceType }`

        invitationOfCareGive.price = price;

        const pet = await Pet.findById( invitation.petId.toString() );
        if( !pet ){
            return {
                error: true,
                message: "Pet Not Found"
            }
        }
        const petInfo = getLightWeightPetInfoHelper( pet );
        
        invitationOfCareGive.pet = petInfo;

        delete invitationOfCareGive.actionCode;
        delete invitationOfCareGive.careGiverParamGuid;
        delete invitationOfCareGive.isAccepted;

        invitationOfCareGive.type = "CareGiveInvitation";

        return {
            error: false,
            data: invitationOfCareGive
        }
    }catch( err ){
        console.log( "ERROR: prepareCareGiveInvitationDataHelper - ", err );
        return {
            error: true,
            message: "Internal Server Error"
        }
    }
}

export default prepareCareGiveInvitationDataHelper;