import SecondaryOwnerInvitation from "../../../models/ownerOperations/SecondaryOwnerInvitation.js";
import PetHandOverInvitation from "../../../models/ownerOperations/PetHandOverInvitation.js";
import InviteOrganizer from "../../../models/Event/Invitations/InviteOrganizer.js";
import EventInvitation from "../../../models/Event/Invitations/InviteEvent.js";
import CareGive from "../../../models/CareGive/CareGive.js";

import prepareInvitationDataHelper from "../../../utils/invitations/prepareInvitationDataHelper.js";

const getAllInvitationsController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const lastItemId = req.body.lastItemId || 'null';
        const limit = parseInt( req.params.limit ) || 15;

        let invitations = [];

        // SecondaryOwnerInvitation sorgusu
        invitations.push(...await SecondaryOwnerInvitation.find({ to: userId }));

        // PetHandOverInvitation sorgusu
        invitations.push(...await PetHandOverInvitation.find({ to: userId }));

        // EventOrganizerInvitation sorgusu
        invitations.push(...await InviteOrganizer.find({ invitedId: userId }));

        // EventInvitation sorgusu
        invitations.push(...await EventInvitation.find({ invitedId: userId }) );

        // CareGive sorgusu
        invitations.push(
            ...await CareGive.find({
                                        "invitation.to": userId,
                                        "invitation.isAccepted": false
                                    })
        );

        // Davetiyeleri tarihe göre sıralama
        invitations.sort(
            ( a, b ) => 
                a.createdAt - b.createdAt
        );

        let skip = lastItemId !== 'null' ? invitations.findIndex( invitation => invitation._id.toString() === req.body.lastItemId ) + 1 : 0;

        const totalCount = invitations.length;
        invitations = invitations.slice(
            skip - 1, 
            ( skip - 1 ) + ( limit - 1 )
        );

        const preparedInvitationList = await prepareInvitationDataHelper( invitations );
        if(
            !preparedInvitationList
            || !( preparedInvitationList.data )
            || preparedInvitationList.length <= 0
            || preparedInvitationList.error
        ){
            console.log( "ERROR: prepareInvitationDataHelper / return " );
            return res.status( 500 ).json({
                error: true,
                message: "Internal Server Error"
            });
        }

        if( preparedInvitationList.length > 1 ){
            preparedInvitationList.sort(
                ( a, b ) => 
                    a.createdAt - b.createdAt
            );
        }

        return res.status( 200 ).json({
            error: false,
            message: "Invitations found succesfully",
            totalCount: totalCount,
            invitations: preparedInvitationList.data,
        });

    }catch( err ){
        console.log( "ERROR: getAllInvitationsController - ", err );
        return res.status( 500 ).json({
            error: true,
            message: "Internal Server Error"
        });
    }
}

export default getAllInvitationsController;