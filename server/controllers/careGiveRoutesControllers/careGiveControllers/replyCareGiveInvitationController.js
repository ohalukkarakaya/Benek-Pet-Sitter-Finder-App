import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";
import CareGive from "../../../models/CareGive/CareGive.js";

import paramPayWithRegisteredCard from "../../../utils/paramRequests/paymentRequests/paramPayWithRegisteredCard.js";
import paramPayRequest from "../../../utils/paramRequests/paymentRequests/paramPayRequest.js";
import paramRegisterCreditCardRequest from "../../../utils/paramRequests/registerCardRequests/paramRegisterCreditCardRequest.js";
import paramAddDetailToOrder from "../../../utils/paramRequests/paymentRequests/paramAddDetailToOrder.js";
import paramsha2b64Request from "../../../utils/paramRequests/paramsha2b64Request.js";

import dotenv from "dotenv";
import bcrypt from "bcrypt";
import QRCode from "qrcode";

dotenv.config();

const replyCareGiveInvitationController = async (req, res) => {
    try{
        const careGiveId = req.params.careGiveId;
        const usersResponse = req.params.response;

        if(!careGiveId || !usersResponse){
            return res.status(400).json(
                {
                    error: true,
                    message: "missing params"
                }
            );
        }

        const invitedCareGive = await CareGive.findById(careGiveId);
        if(!invitedCareGive){
            return res.status(404).json(
                {
                    error: true,
                    message: "care give not found"
                }
            );
        }

        if(
            invitedCareGive.invitation.to !== req.user._id.toString()
            || req.user._id.toString() !== invitedCareGive.petOwner.toString()
        ){
            return res.status(401).json(
                {
                    error: true,
                    message: "you are not authorized to accept this invitation"
                }
            );
        }
        
        if(usersResponse !== "true" && usersResponse !== "false"){
            return res.status(400).json(
                {
                    error: true,
                    message: "Invalid response"
                }
            );
        }

        const response = usersResponse === "true";
        if(response){
            //accept invitation
            const pet = await Pet.findById( invitedCareGive.petId.toString() );
            if(!pet){
                return res.status(404).json(
                    {
                        error: true,
                        message: "pet not found"
                    }
                );
            }

            const careGiver = await User.findById( invitedCareGive.careGiver.careGiverId.toString() );
            if(!careGiver || careGiver.deactivation.isDeactive){
                return res.status(404).json(
                    {
                        error: false,
                        message: "user not found"
                    }
                );
            }

            const petOwner = await User.findById( invitedCareGive.petOwner.petOwnerId.toString() );
            if(!petOwner || petOwner.deactivation.isDeactive){
                return res.status(404).json(
                    {
                        error: true,
                        message: "user not found"
                    }
                );
            }

            const isPetOwner = req.user._id.toString() === invitedCareGive.petOwner.petOwnerId.toString();
            const isEmailValid = petOwner.email;
            if(!isEmailValid){
                return res.status(400).json(
                    {
                        error: true,
                        message: "please verify your email firstly"
                    }
                );
            }

            invitedCareGive.petOwner.petOwnerContact.petOwnerEmail = petOwner.email;
            invitedCareGive.petOwner.petOwnerContact.petOwnerPhone = petOwner.phone;
            invitedCareGive.markModified("petOwner");

            const careGiveHistoryRecordforPet = {
                careGiver: careGiver._id.toString(),
                startDate: invitedCareGive.startDate,
                endDate: invitedCareGive.endDate,
                price: invitedCareGive.prices
            }

            const careGiveHistoryRecordforCareGiver = {
                pet: pet._id.toString(),
                startDate: invitedCareGive.startDate,
                endDate: invitedCareGive.endDate,
                price: invitedCareGive.prices
            }

            const careGiveHistoryRecordforPetOwner = {
                pet: pet._id.toString(),
                careGiver: careGiver._id.toString(),
                startDate: invitedCareGive.startDate,
                endDate: invitedCareGive.endDate,
                price: invitedCareGive.prices
            }

            pet.careGiverHistory.push(careGiveHistoryRecordforPet);
            pet.markModified("careGiverHistory");

            careGiver.caregiverCareer.push(careGiveHistoryRecordforCareGiver);
            careGiver.markModified("caregiverCareer");

            petOwner.pastCaregivers.push(careGiveHistoryRecordforPetOwner);
            petOwner.markModified("pastCaregivers");

            invitedCareGive.invitation.isAccepted = true;

            pet.save().then(
                (_) => {
                    careGiver.save().then(
                        async (__) => {
                            let orderId;
                            let pySiparisGuid;
                            let sanalPosIslemId;
                            let subSellerGuid;

                            if(isPetOwner){
                                const price = invitedCareGive.prices;
                                if(price.priceType !== "Free" && price.servicePrice !== 0){
                                    // get payment
                                    var recordCard = true;
                                    let cardGuid;
                    
                                    cardGuid = req.body.cardGuid.toString();
                                    const cardNo = req.body.cardNo.toString();
                                    const cvv = req.body.cvv.toString();
                                    const cardExpiryDate = req.body.cardExpiryDate.toString();
                                    const user = await User.findById( req.user._id.toString() );
                    
                                    const price = price.servicePrice
                                                       .toLocaleString( 'tr-TR' )
                                                       .replace( '.', '' );
                    
                                    const priceForCareGiver = (
                                                                price.servicePrice - ( 
                                                                        price.servicePrice * 100 
                                                                                     ) / 30
                                                            ).toLocaleString( 'tr-TR' )
                                                             .replace( '.', '' );
                    
                                    if( !user.phone ){
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

                                    const generatedOrderId = invitedCareGive._id + crypto.randomBytes(3).toString('hex');
                                    const careGiveOrderDesc = `${ generatedOrderId } nolu Bakım Hizmeti Siparişi`;
                    
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
                                            careGiveOrderDesc, //order desc
                                            price,
                                            priceForCareGiver,
                                            'NS', //payment type
                                            'https://dev.param.com.tr/tr' // ref url
                                        );
                                        
                                        if( !payWithRegisteredCardRequest || payWithRegisteredCardRequest.error === true ){
                                            //To Do: Check payment data
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
                                                        + price 
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
                                            price,
                                            priceForCareGiver,
                                            cardNo,
                                            cardExpiryDate.split("/")[0],
                                            cardExpiryDate.split("/")[1],
                                            cvv,
                                            phoneNumberWithoutZero,
                                            "https://dev.param.com.tr/tr", //success url
                                            "https://dev.param.com.tr/tr", //error url
                                            generatedOrderId,
                                            careGiveOrderDesc, //order desc
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
                                        price,
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

                                }
                            }
                            petOwner.save().then(
                                async (___) => {
                                    if(isPetOwner){
                                        //generate password
                                        const randPassword = crypto.randomBytes(10).toString('hex');
                                        const salt = await bcrypt.genSalt(Number(process.env.SALT));
                                        const hashCodePassword = await bcrypt.hash(randPassword, salt);

                                        //qr code data
                                        const data = {
                                            careGiveId: invitedCareGive._id.toString(),
                                            petOwner: req.user._id.toString(),
                                            careGiver: invitedCareGive.careGiver.careGiverId.toString(),
                                            pet: invitedCareGive.petId.toString(),
                                            codeType: "Start",
                                            codePassword: randPassword,
                                        }
                    
                                        let qrCodeData = JSON.stringify(data);

                                        // Get the base64 url
                                        QRCode.toDataURL(
                                            qrCodeData,
                                            function (err, url) {
                                                if(err){
                                                    return res.status(500).json(
                                                        {
                                                            error: true,
                                                            message: "error wile generating QR code"
                                                        }
                                                    );
                                                }

                                                invitedCareGive.invitation.actionCode.codeType = "Start";
                                                invitedCareGive.invitation.actionCode.codePassword = hashCodePassword;
                                                invitedCareGive.invitation.actionCode.code = url;
                                                invitedCareGive.markModified("invitation");

                                                invitedCareGive.prices.orderIds.add( orderId );
                                                invitedCareGive.prices.ordersInfoList.add(
                                                    {
                                                        pySiparisGuid: pySiparisGuid,
                                                        sanalPosIslemId: sanalPosIslemId,
                                                        subSellerGuid: subSellerGuid
                                                    }
                                                );
                                                invitedCareGive.markModified("prices");
                                                
                                                invitedCareGive.save().then(
                                                    (____) => {
                                                        res.status(200).json(
                                                            {
                                                                error: false,
                                                                message: "careGive accepted",
                                                                code: url
                                                            }
                                                        );
                                                    }
                                                ).catch(
                                                    (er) => {
                                                        console.log(er);
                                                        return res.status(500).json(
                                                            {
                                                                error: true,
                                                                message: "Internal server error"
                                                            }
                                                        );
                                                    }
                                                );
                                            }
                                        );
                                    }
                                }
                            ).catch(
                                (err) => {
                                    console.log(err);
                                    return res.status(500).json(
                                        {
                                            error: true,
                                            message: "Internal server error"
                                        }
                                    );
                                }
                            );
                        }
                    ).catch(
                        (err) => {
                            console.log(err);
                            return res.status(500).json(
                                {
                                    error: true,
                                    message: "Internal server error"
                                }
                            );
                        }
                    );
                }
            ).catch(
                (err) => {
                    console.log(err);
                    return res.status(500).json(
                        {
                            error: true,
                            message: "Internal server error"
                        }
                    );
                }
            );
        }else{
            //reject invitation
            invitedCareGive.deleteOne().then(
                (_) => {
                    return res.status(200).json(
                        {
                            error: false,
                            message: "Invitation rejected succesfully"
                        }
                    );
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
        }
    }catch(err){
        console.log("Error: care give", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default replyCareGiveInvitationController;