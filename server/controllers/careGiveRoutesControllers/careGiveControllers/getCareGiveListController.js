import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";
import CareGive from "../../../models/CareGive/CareGive.js";

import getLightWeightPetInfoHelper from "../../../utils/getLightWeightPetInfoHelper.js";
import getLightWeightUserInfoHelper from "../../../utils/getLightWeightUserInfoHelper.js";

const getCareGiveListController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const skip = parseInt( req.params.skip ) || 0;
        const limit = parseInt( req.params.limit ) || 15;

        const careGiveQuery = {
            $or: [
                { 
                    $and: [
                        { "invitation.from": userId },
                        { "finishProcess.isFinished": false }
                    ] 
                },
                { 
                    $and: [
                        { "invitation.to": userId },
                        { "finishProcess.isFinished": false }
                    ] 
                },
            ]
        };

        const careGives = await CareGive.find( careGiveQuery )
                                        .skip( skip )
                                        .limit( limit );

        const totalCareGiveCount= await CareGive.countDocuments( careGiveQuery );

        if(
            !careGives
            || careGives.length <= 0
        ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "CareGive Not Found"
                }
            );
        }

        careGives.forEach(
            async ( careGive ) => {
                const careGiver = await User.findById( careGive.careGiver.careGiverId.toString() );
                const careGiverInfo = getLightWeightUserInfoHelper( careGiver );

                const petOwner = await User.findById( careGive.petOwner.petOwnerId.toString() );
                const petOwnerInfo = getLightWeightUserInfoHelper( petOwner );

                const pet = await Pet.findById( careGive.petId.toString() );
                const petInfo = getLightWeightPetInfoHelper( pet );

                let careGiveRoleId;
                if( userId === petOwner._id.toString() ){
                    careGiveRoleId = 1;
                }else if( userId === careGiver._id.toString() ){
                    careGiveRoleId = 2;
                }

                let code;
                if( 
                    (
                        careGive.invitation
                                .actionCode
                                .codeType === "Start"
                        && userId === petOwner._id.toString()
                    )
                    || (
                        careGive.invitation
                            .actionCode
                            .codeType === "Finish"
                        && userId === careGiver._id.toString()
                    )
                ){
                    code = {
                        codeType: careGive.invitation
                                          .actionCode
                                          .codeType,
                        code: careGive.invitation
                                      .actionCode
                                      .code
                    };
                }

                let price;
                if(
                    careGive.prices.priceType !== "Free"
                ){
                    price = `${careGive.prices.servicePrice} ${careGive.prices.priceType}`;
                }else{
                    price = careGive.prices.priceType;
                }

                const careGiveInfo = {
                    id: careGive._id.toString(),
                    careGiveRoleId: careGiveRoleId,
                    careGiverContact: careGive.careGiver
                                      .careGiverContact,
                    petOwnerContact: careGive.petOwner
                                            .petOwnerContact,
                    careGiver: careGiverInfo,
                    petOwner: petOwnerInfo,
                    pet: petInfo,
                    startDate: careGive.startDate,
                    endDate: careGive.endDate,
                    adress: careGive.adress,
                    actionCode: code,
                    isStarted: careGive.isStarted,
                    price: price,
                    missionCount: careGive.missionCallender.length
                }

                careGive = careGiveInfo;
            }
        );

        return res.status( 200 ).json(
            {
                error: false,
                message: "CareGive List Prepared Succesfully",
                totalCareGiveCount: totalCareGiveCount,
                careGiveList: careGives,
            }
        );
    }catch( err ){
        console.log("ERROR: getCareGiveListController - ", err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default getCareGiveListController;