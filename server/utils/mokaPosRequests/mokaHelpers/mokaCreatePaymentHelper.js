import PaymentData from "../../../models/PaymentData/PaymentData.js";
import User from "../../../models/User.js";

import mokaCreate3dPaymentRequest from "../mokaPayRequests/mokaCreate3dPaymentRequest.js";
import mokaRegisterCustomerRequest from "../mokaRegisterCardRequests/mokaCustomerRequests/mokaRegisterCustomerRequest.js";
import mokaGetCustomerRequest from "../mokaRegisterCardRequests/mokaCustomerRequests/mokaGetCustomerRequest.js";
import mokaRegisterCardRequest from "../mokaRegisterCardRequests/mokaCardRequests/mokaRegisterCard.js";

import mokaCheckifCardAlreadyRegisteredHelper from "../mokaHelpers/mokaCheckifCardAlreadyRegisteredHelper.js";

import crypto from "crypto";

const mokaCreatePaymentHelper = async (
    customerUserId,
    cardToken,
    cardNumber,
    cardExpiryMonth,
    cardExpiryYear,
    cardCvc,
    parentContentId,
    paymentType,
    carGiverUserId,
    careGiverGuid,
    amount,
    redirectUrl,
    sholudRegisterCard,
    isFromInvitation
) => { 
    try{
        if( !careGiverGuid ){
            return {
                error: true,
                serverStatus: -1,
                message: "CareGiverGuid is required"
            }
        }
        if(
            !cardToken
            && !(
                cardNumber
                && cardExpiryMonth
                && cardExpiryYear
                && cardCvc
            )
            && !(
                paymentType === "CareGive"
                || paymentType === "EventTicket"
                || paymentType === "Donation"
            )
        ){
            return {
                error: true,
                serverStatus: -1,
                message: "Missing Card or Payment Info"
            }
        }

        const paymentUniqueCode = crypto.randomBytes( 12 )
                                    .toString( 'hex' );

        let payProcess;

        let isPayWithRegisteredCard = cardToken
                                      && cardToken !== undefined
                                      && cardToken !== null;

        let registeredCardInfo;

        const checkCustomer = await mokaGetCustomerRequest( customerUserId );
        const isCustomerRegistered = !( checkCustomer.error )
                                        && (
                                            checkCustomer.serverStatus > 0
                                            || (
                                                checkCustomer.data
                                                && checkCustomer.data
                                                                .sonuc > 0
                                            )
                                        )
                                        && checkCustomer.data
                                        && checkCustomer.data
                                                        .customerData
                                                        .DealerCustomer
                                                        .CustomerCode;

        const customer = await User.findById( customerUserId );
        if( !customer ){
            return {
                error: true,
                serverStatus: -1,
                message: "Customer Not Found"
            }
        }

        if( !isPayWithRegisteredCard ){


            if( !isCustomerRegistered ){

                // check customer users required info
                if( 
                    !(
                        customer.phone
                        && customer.isPhoneVerified
                    )
                    || !(
                        customer.email
                        && customer.isEmailVerified
                    )
                    || !(
                        customer.identity
                                .openAdress
                    )
                ){
                    return {
                        error: true,
                        serverStatus: 0,
                        message: "Please Insert Your Phone & Email & Adress Firstly"
                    }
                }

                var phoneNumberWithoutZero = customer.phone
                                                     .replace(/\D/g, '')
                                                     .slice(-10);

                const registerCustomer = await mokaRegisterCustomerRequest(
                                            customerUserId,
                                            customer.identity.firstName,
                                            customer.identity.lastName,
                                            phoneNumberWithoutZero,
                                            customer.email,
                                            customer.identity
                                                    .openAdress
                                        );

                if( 
                    !registerCustomer
                    || registerCustomer.error
                    || !(
                        registerCustomer.data
                                        .customerData
                                        .DealerCustomer
                                        .DealerCustomerId
                    )
                ){
                    return {
                        error: true,
                        serverStatus: -1,
                        message: "Error While Customer Registration"
                    }
                }
            }

            const isCardAlreadyRegistered = await mokaCheckifCardAlreadyRegisteredHelper(
                                                        customerUserId,
                                                        cardNumber
                                                  );

            if( 
                sholudRegisterCard
                && ! isCardAlreadyRegistered.isCardAlreadyRegistered
            ){

                let cardName = customer.userName 
                                            + "_" 
                                            + customerUserId
                                            + "_"
                                            + crypto.randomBytes( 3 )
                                                    .toString( 'hex' );

                const registerCard = await mokaRegisterCardRequest(
                                                customerUserId,
                                                customer.identity.firstName,
                                                customer.identity.middleName,
                                                customer.identity.lastName,
                                                cardNumber.replaceAll( " ", "" ),
                                                cardExpiryMonth,
                                                cardExpiryYear,
                                                cardName
                                           );

                if(
                    registerCard.error
                    && registerCard.serverStatus === 0
                ){
                    return registerCard
                }

                registeredCardInfo = registerCard.data
                                                 .customerData
                                                 .CardList
                                                 .find(
                                                    cardObject =>
                                                        cardObject.CardName === cardName
                                                 );

                if(
                    !registerCard
                    || registerCard.error
                    || !(
                        registerCard.data
                                    .customerData
                                    .CardList

                        && registeredCardInfo

                        && registerCard.data
                                       .customerData
                                       .CardList
                                       .length >= customer.cardGuidies
                                                          .length
                    )
                ){
                    return {
                        error: true,
                        serverStatus: registerCard.serverStatus,
                        message: registerCard.message
                    }
                }

                const cardDataToSave = {
                    cardName: registeredCardInfo.CardName,
                    cardGuid: registeredCardInfo.CardToken
                };

                customer.cardGuidies = customer.cardGuidies !== undefined
                                            ? customer.cardGuidies
                                                      .push( cardDataToSave )
                                            
                                            : customer.cardGuidies = [ cardDataToSave ];

                customer.markModified( "cardGuidies" );
            }
        }

        const isCardRegistered = (
            registeredCardInfo
            && registeredCardInfo !== undefined
            && registeredCardInfo !== null
        );

        isPayWithRegisteredCard
        || isCardRegistered
            ? payProcess = await mokaCreate3dPaymentRequest(
                isPayWithRegisteredCard
                    ? cardToken
                    : registeredCardInfo.CardToken,
                customer.identity.firstName,
                customer.identity.middleName,
                customer.identity.lastName,
                null, // card Number
                null, //card exp month
                null, //card exp year
                null ,// card cvc
                amount,
                paymentUniqueCode,
                paymentType,
                redirectUrl,
                careGiverGuid,
                30
            )

            : payProcess = await mokaCreate3dPaymentRequest(
                null, // card token
                customer.identity.firstName,
                customer.identity.middleName,
                customer.identity.lastName,
                cardNumber, // card Number
                cardExpiryMonth, //card exp month
                cardExpiryYear, //card exp year
                cardCvc ,// card cvc
                amount,
                paymentUniqueCode,
                paymentType,
                redirectUrl,
                careGiverGuid,
                30
            );

        if( isCardRegistered ){
            customer.save(
                function ( err ) {
                    if( err ) {
                        console.error( 'ERROR: While Saving Customer!' );
                    }
                  }
            );
        }


        if(
            !payProcess
            || payProcess.error
            || !(
                payProcess.data
                          .threeDPayData
                          .Url

                && payProcess.data
                             .threeDPayData
                             .Url !== undefined

                && payProcess.data
                             .threeDPayData
                             .Url !== null
            )
            || !(
                payProcess.data
                          .threeDPayData
                          .CodeForHash

                && payProcess.data
                             .threeDPayData
                             .CodeForHash !== undefined

                && payProcess.data
                             .threeDPayData
                             .CodeForHash !== null
            )
        ){
            return {
                error: true,
                serverStatus: payProcess.serverStatus,
                message: payProcess.message
            }
        }

        const savedPaymentData = await new PaymentData(
            {
                paymentUniqueCode: paymentUniqueCode,
                subSellerId: carGiverUserId,
                customerId: customerUserId,
                subSellerGuid: careGiverGuid,
                priceData: {
                    price: amount
                },
                parentContentId: parentContentId,
                type: paymentType,
                isFromInvitation: isFromInvitation,
                threeDUrl: payProcess.data.threeDPayData.Url,
                codeForHash: payProcess.data.threeDPayData.CodeForHash,
                virtualPosOrderId: null
            }
        ).save();

        const processedPaymentData = {
            error: false,
            serverStatus: 1,
            message: "Payment Open Succesfully",
            payData: {
                paymentDataId: savedPaymentData._id.toString(),
                paymentUniqueCode: savedPaymentData.paymentUniqueCode,
                threeDUrl: savedPaymentData.threeDUrl,
            }
        };

        return processedPaymentData;
    }catch( err ){
        console.log( "ERROR: mokaCreatePaymentHelper - ", err );
        return {
            error: true,
            serverStatus: -1,
            message: " Internal Server Error"
        }
    }
}

export default mokaCreatePaymentHelper;