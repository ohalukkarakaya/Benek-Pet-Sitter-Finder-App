import CareGive from "../../../../models/CareGive/CareGive.js";
import User from "../../../../models/User.js";

import sendNotification from "../../../../utils/sendNotification.js";
import paramPayWithRegisteredCard from "../../../../utils/paramRequests/paymentRequests/paramPayWithRegisteredCard.js";
import paramPayRequest from "../../../../utils/paramRequests/paymentRequests/paramPayRequest.js";
import paramRegisterCreditCardRequest from "../../../../utils/paramRequests/registerCardRequests/paramRegisterCreditCardRequest.js";
import paramAddDetailToOrder from "../../../../utils/paramRequests/paymentRequests/paramAddDetailToOrder.js";
import paramsha2b64Request from "../../../../utils/paramRequests/paramsha2b64Request.js";

import dotenv from "dotenv";

dotenv.config();

const scheduleMissionController = async (req, res) => {
    try{
        const careGiveId = req.params.careGiveId.toString();
        const missionDesc = req.body.missionDesc.toString();
        const missionDate = Date.parse(req.body.missionDate.toString());

        let orderId;
        let pySiparisGuid;
        let sanalPosIslemId;
        let subSellerGuid;

        if(!careGiveId || !missionDesc || !missionDate){
            return res.status(400).json(
                {
                    error: true,
                    message: "Missing param"
                }    
            );
        }
        
        const careGive = await CareGive.findById(careGiveId);
        if(!careGive){
            return res.status(404).json(
                {
                    error: true,
                    message: "Care give not found"
                }
            );
        }
        const isVolunteer = careGive.prices.priceType === "Free";
        if(isVolunteer){
            return res.status(401).json(
                {
                    error: true,
                    message: "You can't schedule mission for Free careGive"
                }
            );
        }

        if( Date.parse(careGive.endDate) < missionDate ){
            return res.status(400).json(
                {
                    error: true,
                    message: "You can't insert mission on this date"
                }
            );
        }

        const areThereMissionAtSameTime = careGive.missionCallender.find(
            missionObject => 
                missionObject.missionDate === missionDate
        );
        if(areThereMissionAtSameTime){
            return res.status(400).json(
                {
                    error: true,
                    message: "there is allready mission scheduled at this time"
                }
            );
        }

        if( careGive.petOwner.petOwnerId.toString() !== req.user._id.toString() ){
            return res.status(400).json(
                {
                    error: true,
                    message: "You are not auyhorized to schedule mission for this pet"
                }
            );
        }

        const price = careGive.prices.extraMissionPrice
            
        const priceForService = price.toLocaleString( 'tr-TR' )
                                     .replace( '.', '' );

        const isExtraMission = careGive.missionCallender.length >= careGive.prices.maxMissionCount;
        if(isExtraMission){
            var recordCard = true;
            let cardGuid;

            const priceForCareGiver = (
                                       price.servicePrice - ( 
                                                             price.servicePrice * 100 
                                                            ) / 30
                                      ).toLocaleString( 'tr-TR' )
                                       .replace( '.', '' );

            cardGuid = req.body.cardGuid.toString();
            const cardNo = req.body.cardNo.toString();
            const cvv = req.body.cvv.toString();
            const cardExpiryDate = req.body.cardExpiryDate.toString();
            const user = await User.findById( req.user._id.toString() );

            if( !user || user.isDeactive || !user.phone ){
                return res.status( 400 ).json(
                    {
                        error: true,
                        message: "user doesn't have phone number inserted"
                    }
                );
            }
            var phoneNumberWithoutZero = user.phone.replace(/\D/g, '').slice(-10);

            //take payment
            if( req.body.recordCard && req.body.recordCard === false ){
                recordCard = false;
            }

            const generatedOrderId = careGive._id + crypto.randomBytes(3).toString('hex');
            const ExtraMissionOrderDesc = `Ekstra Bakım Hizmeti Siparişi, No: ${ generatedOrderId }`;

            if( 
                cardGuid 
                || (
                    recordCard
                    && cardNo
                    && cvv
                    && cardExpiryDate
                )
            ){
                if(
                    !cardGuid
                    && recordCard
                    && cardNo
                    && cvv
                    && cardExpiryDate
                ){
                    const cardName = user.userName + crypto.randomBytes(6).toString('hex');
                    //register card
                    const registerCardRequest = await paramRegisterCreditCardRequest(
                        user.identity.firstName, //firstname
                        user.identity.middleName, //middlename
                        user.identity.lastName, //lastname
                        cardNo, //card no
                        cardExpiryDate.split("/")[0], //expiry date month
                        cardExpiryDate.split("/")[1], //expiry date year
                        cardName // random card name to keep it
                    );

                    if( !registerCardRequest || registerCardRequest.error === true ){
                        return res.status(500).json(
                            {
                                error: true,
                                message: "error while registering card"
                            }
                        );
                    }

                    cardGuid = registerCardRequest.data.ksGuid;

                    user.cardGuidies.push(
                        {
                            cardName: cardName,
                            cardGuid: cardGuid
                        }
                    );
                    
                    user.markModified("cardGuidies");
                    user.save(
                        (err) => {
                            if(err){
                                console.log(err);
                            }
                        }
                    );
                }

                const payWithRegisteredCardRequest = await paramPayWithRegisteredCard(
                    cardGuid, //kkGuid
                    cvv, //cvv
                    phoneNumberWithoutZero,//phone number
                    "https://dev.param.com.tr/tr", //success url
                    "https://dev.param.com.tr/tr", //error url
                    generatedOrderId, //order Id
                    ExtraMissionOrderDesc, //order desc
                    priceForService,
                    priceForCareGiver,
                    'NS', //payment type
                    'https://dev.param.com.tr/tr' // ref url
                );
                
                if( !payWithRegisteredCardRequest || payWithRegisteredCardRequest.error === true ){
                    //Check payment data
                    return res.status(500).json(
                        {
                            error: true,
                            message: "error paying with registered card"
                        }
                    );
                }
                //set order id
                orderId = payWithRegisteredCardRequest.data.islemID;
            } else if(
                !cardGuid 
                && !recordCard
                && cardNo
                && cvv
                && cardExpiryDate
            ){
                const shaData = process.env.PARAM_CLIENT_CODE 
                                + process.env.PARAM_GUID 
                                + 1 
                                + priceForService 
                                + priceForCareGiver
                                + generatedOrderId;

                // take payment regularly
                const sha2b64Request = await paramsha2b64Request( shaData );
                if( 
                    !sha2b64Request 
                    || sha2b64Request.error === true 
                    || !( sha2b64Request.data.sha2b64result ) 
                ){
                    return res.status( 500 ).json(
                        {
                            error: true,
                            message: "error on sha2b64 crypto api"
                        }
                    );
                } 

                const paramRegularPayRequest = await paramPayRequest(
                    user.identity.firstName, //firstname
                    user.identity.middleName, //middlename
                    user.identity.lastName, //lastname
                    priceForService,
                    priceForCareGiver,
                    cardNo,
                    cardExpiryDate.split("/")[0],
                    cardExpiryDate.split("/")[1],
                    cvv,
                    phoneNumberWithoutZero,
                    "https://dev.param.com.tr/tr", //success url
                    "https://dev.param.com.tr/tr", //error url
                    generatedOrderId,
                    ExtraMissionOrderDesc, //order desc
                    sha2b64Request.data.sha2b64result.toString(),
                    "NS",
                    'https://dev.param.com.tr/tr' // ref url
                );

                if( 
                    !paramRegularPayRequest 
                    || payRequest.error === true 
                    || !( payRequest.data.islemId ) 
                ){
                    return res.status( 500 ).json(
                        {
                            error: true,
                            message: "error on pay request"
                        }
                    );
                }

                orderId = payRequest.data.islemId;
            }else{
                return res.status( 400 ).json(
                    {
                        error: true,
                        message: "Missing payment info"
                    }
                );
            }

            if( !orderId ){
                return res.status( 500 ).json(
                    {
                        error: true,
                        message: "Internal server error"
                    }
                );
            }

            //add order detail
            const subsellerGuid = invitedCareGive.invitation.careGiverParamGuid;
            const paramAddDetailToOrderRequest = await paramAddDetailToOrder(
                priceForService,
                priceForCareGiver,
                orderId,
                subsellerGuid
            );

            if( 
                !paramAddDetailToOrderRequest 
                || !paramAddDetailToOrderRequest.PYSiparis_GUID
                || !paramAddDetailToOrderRequest.SanalPOS_Islem_ID
                || paramAddDetailToOrderRequest.error === true 
            ){
                return res.status( 500 ).json(
                    {
                        error: true,
                        message: "Internal server error"
                    }
                );
            }

            pySiparisGuid = paramAddDetailToOrderRequest.data.PYSiparis_GUID;
            sanalPosIslemId = paramAddDetailToOrderRequest.data.SanalPOS_Islem_ID;
            subSellerGuid = paramAddDetailToOrderRequest.data.GUID_AltUyeIsyeri;

            careGive.prices.maxMissionCount = careGive.prices.maxMissionCount + 1;
            careGive.prices.boughtExtra = careGive.prices.boughtExtra + 1;
            careGive.markModified("prices");
            
        }

        careGive.missionCallender.push(
            {
                missionDesc: missionDesc,
                missionDate: missionDate,
                missionDeadline: new Date.parse(missionDate + 1*60*60*1000),
                isExtra: isExtraMission,
                extraMissionInfo: {
                    orderI: orderId,
                    pySiparisGuid: pySiparisGuid,
                    sanalPosIslemId: sanalPosIslemId,
                    subSellerGuid: subSellerGuid,
                    paidPrice: priceForService
                }
            }
        );
        careGive.markModified("missionCallender");
        careGive.save().then(
            async ( savedCareGive ) => {

                const savedMission = savedCareGive.missionCallender
                                                  .find(
                                                        missionObject =>
                                                            missionObject.missionDesc === missionDesc
                                                            && missionObject.missionDate === missionDate
                                                            && missionDeadline === Date.parse(missionDate + 1*60*60*1000)
                                                    );

                if( savedMission ){
                    
                    await sendNotification(
                        savedCareGive.petOwner
                                     .petOwnerId
                                     .toString(),
                        savedCareGive.careGiver
                                     .careGiverId
                                     .toString(),
                        "newMission",
                        savedMission._id
                                    .toString(),
                        "careGive",
                        savedCareGive._id
                                     .toString(),
                        null,
                        null
                    );

                    return res.status(200).json(
                        {
                            error: false,
                            message: "mission inserted succesfully",
                            savedCareGiveId :savedCareGive._id.toString(),
                            savedMissionId: savedMission._id.toString()
                        }
                    );
                }
            }
        ).catch(
            (error) => {
                if(error){
                    console.log(error);
                    return res.status(500).json(
                        {
                            error: true,
                            message: "Internal server error"
                        }
                    );
                }
            }
        );
    }catch(err){
        console.log("Error: schedule care give mission - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default scheduleMissionController;