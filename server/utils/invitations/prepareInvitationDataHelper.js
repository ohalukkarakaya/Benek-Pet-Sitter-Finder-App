import SecondaryOwnerInvitation from "../../models/ownerOperations/SecondaryOwnerInvitation.js";
import PetHandOverInvitation from "../../models/ownerOperations/PetHandOverInvitation.js";
import InviteOrganizer from "../../models/Event/Invitations/InviteOrganizer.js";
import EventInvitation from "../../models/Event/Invitations/InviteEvent.js";
import CareGive from "../../models/CareGive/CareGive.js";

import prepareSecondaryOwnerInvitationDataHelper from "./invitationDataHelpers/prepareSecondaryOwnerInvitationDataHelper.js";
import preparePetHandOverInvitationDataHelper from "./invitationDataHelpers/preparePetHandOverInvitationDataHelper.js";
import prepareInviteOrganizerDataHelper from "./invitationDataHelpers/prepareInviteOrganizerDataHelper.js";
import prepareEventInvitationDataHelper from "./invitationDataHelpers/prepareEventInvitationDataHelper.js";
import prepareCareGiveInvitationDataHelper from "./invitationDataHelpers/prepareCareGiveInvitationDataHelper.js";

const prepareInvitationDataHelper = async ( invitationList ) => {
    try{
        let preparedInvitationList = [];
        for(
            let invitation
            of invitationList
        ){
            let preparedInvitationData;
            switch ( invitation.constructor ) {
                case SecondaryOwnerInvitation:
                    // SecondaryOwnerInvitation şemasına ait veri
                    // İşlemleri...
                    preparedInvitationData = await prepareSecondaryOwnerInvitationDataHelper( invitation );
                break;

                case PetHandOverInvitation:
                    // PetHandOverInvitation şemasına ait veri
                    // İşlemleri...
                    preparedInvitationData = await preparePetHandOverInvitationDataHelper( invitation );
                break;

                case InviteOrganizer:
                    // InviteOrganizer şemasına ait veri
                    // İşlemleri...
                    preparedInvitationData = await prepareInviteOrganizerDataHelper( invitation );
                break;

                case EventInvitation:
                    // EventInvitation şemasına ait veri
                    // İşlemleri...
                    const preparedInvitationData = await prepareEventInvitationDataHelper( invitation );
                break;

                case CareGive:
                    // CareGive şemasına ait veri
                    // İşlemleri...
                    try{
                        const preparedInvitationData = await prepareCareGiveInvitationDataHelper( invitation );
                        if(
                            !preparedInvitationData
                            || !preparedInvitationData.data
                            || preparedInvitationData.error
                        ){
                            break;
                        }

                        preparedInvitationList.push( preparedInvitationData.data );
                    }catch( err ){
                        console.log( "ERROR: prepareCareGiveInvitationDataHelper / case - ", err );
                        break;
                    }
                break;

                default:
                  // Beklenmedik durumlar
                break;
            }

            if(
                preparedInvitationData
                && preparedInvitationData.data
                && !( preparedInvitationData.error )
            ){
                newInvitationList.push( preparedInvitationData.data );
            }
        }

        // eğer liste eleman sayısında sorun varsa ( bazı gelen veriler eksik olabilir, 
        // silinmiş davetiye gibi istisnai. ) bu gibi durumlarda gelen liste eleman sayısı
        // sonuç eleman sayısına eşit olmayabilir
        if(
            !preparedInvitationList
            || !preparedInvitationList.length <= 0
        ){
            return {
                error: true,
                message: "Internal Server Error"
            }
        }

        // başarılı durum
        return {
            error: false,
            data: preparedInvitationList
        }
    }catch( err ){
        console.log( "ERROR: prepareInvitationDataHelper - ", err );
        return {
            error: true,
            messae: "Internal Server Error"
        }
    }
}

export default prepareInvitationDataHelper;