import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";
import CareGive from "../../../models/CareGive/CareGive.js";

const getCareGiveInvitationsController = async ( req, res ) => {
    try{

        const userId = req.user._id.toString();
        const skip = parseInt( req.params.skip ) || 0;
        const limit = parseInt( req.params.limit ) || 15;

        const invitationQuery = {
            "invitation.to": userId,
            "invitation.isAccepted": false
        };
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
                const sender = await User.findById( 
                    invitation.from
                              .toString() 
                );

                const senderInfo = {

                    userId: sender._id
                                  .toString(),
    
                    userProfileImg: sender.profileImg
                                          .imgUrl,
    
                    username: sender.userName,
    
                    userFullName: `${
                            sender.identity
                                  .firstName
                        } ${
                            sender.identity
                                  .middleName
                        } ${
                            sender.identity
                                  .lastName
                        }`.replaceAll( "  ", " ")
                }

                invitation.from = senderInfo;

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
                message: "Releated Care Give Inventations Listed",
                totalInvitationCount: totalInvitationCount,
                invitations: invitedCareGives
            }
        );

    }catch( err ){
        console.log("ERROR: getCareGiveInvitationsController - ", err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default getCareGiveInvitationsController;