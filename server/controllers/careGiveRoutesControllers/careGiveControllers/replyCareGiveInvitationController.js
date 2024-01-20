import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";
import CareGive from "../../../models/CareGive/CareGive.js";
import PaymentData from "../../../models/PaymentData/PaymentData.js";

import dotenv from "dotenv";

import mokaCreatePaymentHelper from "../../../utils/mokaPosRequests/mokaHelpers/mokaCreatePaymentHelper.js";
import prepareCareGiveTicketHelper from "../../../utils/prepareCareGiveTicketHelper.js";

dotenv.config();

const replyCareGiveInvitationController = async ( req, res ) => {
    try{
        //coming data
        const careGiveId = req.params.careGiveId;
        const usersResponse = req.params.response;

        if(
            !careGiveId 
            || !usersResponse
        ){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "missing params"
                            }
                       );
        }

        const invitedCareGive = await CareGive.findById( careGiveId );
        if( !invitedCareGive ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "care give not found"
                            }
                       );
        }

        if(
            invitedCareGive.invitation.to !== req.user._id.toString()
            || req.user._id.toString() !== invitedCareGive.petOwner
                                                          .petOwnerId
                                                          .toString()
        ){
            return res.status( 401 )
                      .json(
                            {
                                error: true,
                                message: "you are not authorized to accept this invitation"
                            }
                       );
        }

        if( invitedCareGive.invitation.isAccepted ){
            return res.status( 400 )
                      .json(
                        {
                            error: true,
                            message: "Already Accepted"
                        }
                      );
        }
        
        if(
            usersResponse !== "true" 
            && usersResponse !== "false"
        ){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "Invalid response"
                            }
                       );
        }

        const response = usersResponse === "true";
        if( response ){
            //accept invitation
            const pet = await Pet.findById( invitedCareGive.petId.toString() );
            if( !pet ){
                return res.status( 404 ).json({
                    error: true,
                    message: "pet not found"
                });
            }

            const careGiver = await User.findById( invitedCareGive.careGiver.careGiverId.toString() );
            if(
                !careGiver 
                || careGiver.deactivation.isDeactive
                || careGiver.blockedUsers.includes( invitedCareGive.petOwner.petOwnerId.toString() )
            ){
                return res.status( 404 ).json({
                    error: false,
                    message: "user not found"
                });
            }

            const petOwner = await User.findById( invitedCareGive.petOwner.petOwnerId.toString() );
            if(
                !petOwner
                || petOwner.deactivation.isDeactive
                || petOwner.blockedUsers.includes( invitedCareGive.careGiver.careGiverId.toString() )
            ){
                return res.status( 404 ).json({
                    error: true,
                    message: "user not found"
                });
            }

            const isPetOwner = req.user._id.toString() === invitedCareGive.petOwner.petOwnerId.toString();
            const isEmailValid = petOwner.email;
            if( !isEmailValid ){
                return res.status( 400 ).json({
                    error: true,
                    message: "please verify your email firstly"
                });
            }

            if( isPetOwner ){
                if(
                    invitedCareGive.prices.priceType !== "Free" 
                    && invitedCareGive.prices.servicePrice !== 0
                ){
                    const didAlreadyPay = await PaymentData.findOne({ parentContentId: invitedCareGive._id.toString() });
                    if(
                        didAlreadyPay
                        || invitedCareGive.invitation.isAccepted
                    ){
                        return res.status( 400 ).json({
                            error: true,
                            message: "Already Paid"
                        });
                    }

                    const cardGuid = req.body.cardGuid 
                                        ? req.body.cardGuid.toString() 
                                        : null;
        
                    const cardNo = req.body.cardNo.toString();
                    const cvv = req.body.cvc.toString();
                    const cardExpiryDate = req.body.cardExpiryDate.toString();
                    const userId = req.user._id.toString();
                    const price = parseFloat( invitedCareGive.prices.servicePrice );
        
                    const redirectUrl = process.env.BASE_URL + "/api/payment/redirect";
        
                    const paymentData = await mokaCreatePaymentHelper(
                        userId, //customer user id
                        cardGuid, //card guid
                        cardNo, //card number
                        cardExpiryDate.split("/")[0], //card expiry month
                        cardExpiryDate.split("/")[1], //card expiry year
                        cvv, //card cvv
                        invitedCareGive._id.toString(), //parent id
                        null,
                        "CareGive", //payment type
                        null,
                        invitedCareGive.careGiver.careGiverId, //caregiver id
                        invitedCareGive.invitation.careGiverPosGuid, //caregiver guid
                        price, // amount
                        redirectUrl,
                        req.body.recordCard === 'true',
                        false // is from invitation
                    );
        
                    if( paymentData.message === 'Daily Limit Exceeded' ){
                        return res.status( 500 ).json({
                            error: true,
                            message: "CareGiver Daily Limit Exceeded",
                            payError: paymentData
                        });
                    }
        
                    if(
                        !paymentData 
                        || paymentData.error 
                        || paymentData.serverStatus !== 1 
                        || !paymentData.payData 
                        || paymentData.payData === null 
                        || paymentData.payData === undefined
                    ){
                        return res.status( 500 ).json({
                            error: true,
                            message: "Error While Payment",
                            payError: paymentData
                        });
                    }
        
                    return res.status( 200 ).json({
                        error: false,
                        message: "Waiting for 3d payment approve",
                        payData: paymentData.payData,
                        code: null
                    });
                }
            }
            // Get the base64 url
            const careGiveTicketData = await prepareCareGiveTicketHelper(
                invitedCareGive._id.toString(),
                "Free_Care_Give", //virtualPosOrderId
                "Free_Care_Give", //paymentDataId
                "Free_Care_Give", //orderUniqueCode
            );

            if(
                !careGiveTicketData
                || careGiveTicketData.error
            ){
                return res.status( 500 ).json({
                    error: true,
                    message: "Internal Server Error"
                });
            }

            return res.status( 200 ).json({
                error: false,
                message: "careGive accepted",
                code: careGiveTicketData.url
            });
        }else{
            //reject invitation
            invitedCareGive.deleteOne().then(
                (_) => {
                    return res.status( 200 ).json({
                        error: false,
                        message: "Invitation rejected succesfully"
                    });
                }
            ).catch(
                ( error ) => {
                    if( error ){
                        console.log( error );
                        return res.status( 500 ).json({
                            error: true,
                            message: "Internal server error"
                        });
                    }
                }
            );
        }
    }catch( err ){
        console.log( "Error: care give", err );
        return res.status( 500 ).json({
            error: true,
            message: "Internal server error"
        });
    }
}

export default replyCareGiveInvitationController;