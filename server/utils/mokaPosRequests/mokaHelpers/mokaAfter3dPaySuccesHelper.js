import User from "../../../models/User.js";

import prepareEventTicketHelper from "../../prepareEventTicketHelper.js";
import prepareCareGiveTicketHelper from "../../prepareCareGiveTicketHelper.js";

const mokaAfter3dPaySuccesHelper = async ( virtualPosOrderId, paymentData ) => {
    try {
        let preparedData = null;

        if(
            paymentData.type === "EventTicket"
        ){
            const parentId = paymentData.parentContentId;

            const careGiver = await User.findById( paymentData.subSellerId );
            
            const preparedTicketData = await prepareEventTicketHelper(
                paymentData.customerId,
                paymentData.isFromInvitation
                    ? parentId
                    : null,
                paymentData.isFromInvitation
                    ? null
                    : parentId,
                virtualPosOrderId,
                careGiver.careGiveGUID,
                paymentData.paymentUniqueCode
                );

            if( preparedTicketData ){
                return  preparedTicketData;
            }
        }

        if(
            paymentData.type === "CareGive"
        ){
            const preparedTicketData = await prepareCareGiveTicketHelper(
                    paymentData.customerId,
                    paymentData.parentContentId,
                    null,
                    virtualPosOrderId,
                    paymentData._id.toString(),
                    paymentData.paymentUniqueCode
                );

            if( preparedTicketData ){
                return  preparedTicketData;
            }
        }

        return preparedData || {
            error: true,
            serverStatus: -1,
            message: "Unexpected Payment Type"
        };

    }catch( err ){
        console.log( "ERROR: mokaAfter3dPaySuccesHelper -", err );
        return {
            error: true,
            serverStatus: -1,
            message: "Internal Server Error"
        };
    }
};

export default mokaAfter3dPaySuccesHelper;
