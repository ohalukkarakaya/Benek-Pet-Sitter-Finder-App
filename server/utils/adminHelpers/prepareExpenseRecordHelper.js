import ExpenseRecord from "../../models/PaymentData/ExpenseRecord.js";
import User from "../../models/User.js";
import CareGive from "../../models/CareGive/CareGive.js";
import Event from "../../models/Event/Event.js";
import Pet from "../../models/Pet.js";

// Helpers
import getLightWeightUserInfoHelper from "../getLightWeightUserInfoHelper.js";
import getLightWeightEventInfoHelper from "../getLightWeightEventInfoHelper.js";
import getLightWeightCareGiveInfoHelper from "../getLightWeightCareGiveInfoHelper.js";
import getLightWeightPetInfoHelper from "../getLightWeightPetInfoHelper.js";

const prepareExpenseRecordHelper = async ( expenseRecordIdList ) => {
    try{
        let expenseRecordInfoList = [];
        for( let expenseRecordId of expenseRecordIdList ){
            let preparedExpenseRecordData;
            const expenseRecord = await ExpenseRecord.findById( expenseRecordId );
            if( !expenseRecord ){
                break;
            }

            const careGiver = await User.findById( expenseRecord.careGiverId.toString() );
            if( !careGiver){
                break;
            }
            const careGiverInfo = getLightWeightUserInfoHelper( careGiver );

            const customer = await User.findById( expenseRecord.customerId.toString() );
            if( !customer ){
                break;
            }
            const customerInfo = getLightWeightUserInfoHelper( customer );
            
            let parentContent;
            if( 
                expenseRecord.type === "CareGive"
                || expenseRecord.type === "CareGiveExtension"
                || expenseRecord.type === "ExtraMission"
            ){
                const careGive = await CareGive.findById( expenseRecord.parentContentId.toString() );
                if( careGive ){
                    const pet = await Pet.findById( careGive.petId.toString() );
                    if( pet ){
                        const petInfo = getLightWeightPetInfoHelper( pet );

                        parentContent = await getLightWeightCareGiveInfoHelper(
                            careGiverInfo,
                            customerInfo,
                            petInfo,
                            null,
                            careGive
                        );
                    }
                }
            }else{
                const parentContentEvent = await Event.findById( expenseRecord.parentContentId.toString() );
                if( !parentContentEvent ){
                    parentContent = await getLightWeightEventInfoHelper( parentContentEvent );
                }
            }

            const priceData = `${ expenseRecord.priceData.price } ${ expenseRecord.priceData.priceType }`;

            let expenseDocumentInfo = {
                subSeller: careGiverInfo,
                customer: customerInfo,
                priceData: priceData,
                parentContentType: expenseRecord.type,
                parentContent: parentContent,
                productDesc: expenseRecord.productDesc.toString(),
                documentUrl: expenseRecord.expensePdfDocumentUrl.toString()
            }

            expenseRecordInfoList.push( expenseDocumentInfo );
        }

        return { error: false, data: expenseRecordInfoList }
        
    }catch( err ){
        console.log( "ERROR: prepareExpenseRecordHelper - ", err );
        return { error: true, message: "Internal Server Error" }
    }
}

export default prepareExpenseRecordHelper;