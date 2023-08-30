import prepareEventTicketHelper from "../../prepareEventTicketHelper.js";


const mokaAfter3dPaySuccesHelper = async ( paymentData ) => {
    try{
        let preparedData;
        switch( paymentData.type ){
            case "CareGive":
                //not yet
            break;

            case "EventTicket":
                preparedData = await prepareEventTicketHelper( 
                                        paymentData.customerId,
                                        paymentData.isFromInvitation
                                            ? paymentData.parentContentId
                                            : null,
                                        paymentData.isFromInvitation
                                            ? null
                                            : paymentData.parentContentId
                                     );
            break;

            case "Donation":
                // not yet
            break;
        }
        return preparedData;
    }catch( err ){
        console.log( "ERROR: mokaAfter3dPaySuccesHelper -", err );
        return {
            error: true,
            serverStatus: -1,
            message: "Internal Server Error"
        }
    }
}

export default mokaAfter3dPaySuccesHelper;