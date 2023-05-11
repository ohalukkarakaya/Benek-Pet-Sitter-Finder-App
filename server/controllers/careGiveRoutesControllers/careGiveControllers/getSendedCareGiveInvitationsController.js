import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";
import CareGive from "../../../models/CareGive/CareGive.js";

const getSendedCareGiveInvitationsController = async ( req, res ) => {
    try{

        const userId = req.user._id.toString();
        const skip = parseInt( req.params.skip ) || 0;
        const limit = parseInt( req.params.limit ) || 15;

        const invitedCareGives = await CareGive.find(
            {
                "invitation.from": userId,
                "invitation.isAccepted": false
            }
        ).skip( skip )
         .limit( limit );

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

                const invitedUserInfo = {

                    userId: invitedUser._id
                                       .toString(),
    
                    userProfileImg: invitedUser.profileImg
                                               .imgUrl,
    
                    username: invitedUser.userName,
    
                    userFullName: `${
                            invitedUser.identity
                                       .firstName
                        } ${
                            invitedUser.identity
                                       .middleName
                        } ${
                            invitedUser.identity
                                       .lastName
                        }`.replaceAll( "  ", " ")
                }

                invitation.to = invitedUserInfo;

                const price = careGiveObject.prices.priceType !== "Free" 
                                    ? `${careGiveObject.prices.servicePrice} ${careGiveObject.prices.priceType}`
                                    : `${careGiveObject.prices.priceType}`

                invitation.price = price;

                const pet = await Pet.findById( careGiveObject.petId.toString() );
                const petInfo = {
                    petId: pet._id.toString(),
                    petProfileImgUrl: pet.petProfileImg.imgUrl,
                    petName: pet.name,
                    sex: pet.sex,
                    birthDay: pet.birthDay,
                    kind: pet.kind,
                    species: pet.species,
                    handoverCount: pet.handOverRecord.length
                }
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