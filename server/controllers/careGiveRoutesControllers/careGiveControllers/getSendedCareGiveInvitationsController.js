import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";
import CareGive from "../../../models/CareGive/CareGive.js";

import getLightWeightPetInfoHelper from "../../../utils/getLightWeightPetInfoHelper.js";
import getLightWeightUserInfoHelper from "../../../utils/getLightWeightUserInfoHelper.js";

const getSendedCareGiveInvitationsController = async ( req, res ) => {
    try{

        const userId = req.user._id.toString();
        const skip = parseInt( req.params.skip ) || 0;
        const limit = parseInt( req.params.limit ) || 15;

        const invitationQuery = {
            "invitation.from": userId,
            "invitation.isAccepted": false
        }
        const invitedCareGives = await CareGive.find( invitationQuery )
                                               .skip( skip )
                                               .limit( limit );

        const totalInvitationCount = await CareGive.countDocuments( invitationQuery );

        if( 
            !invitedCareGives
            || invitedCareGives.length <= 0 
        ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "No Invitation Found"
                }
            );
        }

        invitedCareGives.forEach(
            async ( careGiveObject ) => {
                const invitation = careGiveObject.invitation;
                const invitedUser = await User.findById( 
                    invitation.to
                              .toString() 
                );

                const invitedUserInfo = getLightWeightUserInfoHelper( invitedUser );

                invitation.to = invitedUserInfo;

                const price = careGiveObject.prices.priceType !== "Free" 
                                    ? `${careGiveObject.prices.servicePrice} ${careGiveObject.prices.priceType}`
                                    : `${careGiveObject.prices.priceType}`

                invitation.price = price;

                const pet = await Pet.findById( careGiveObject.petId.toString() );
                const petInfo = getLightWeightPetInfoHelper( pet );

                invitation.pet = petInfo;

                delete invitation.actionCode;
                delete invitation.careGiverParamGuid;
                delete invitation.isAccepted;

                careGiveObject = invitation;
            }
        );

        return res.status( 200 ).json(
            {
                error: false,
                message: "Sended Care Give Inventations Listed",
                totalInvitationCount: totalInvitationCount,
                invitations: invitedCareGives
            }
        );

    }catch( err ){
        console.log("ERROR: getSendedCareGiveInvitationsController - ", err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default getSendedCareGiveInvitationsController;