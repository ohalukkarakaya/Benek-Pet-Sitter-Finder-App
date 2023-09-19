import PaymentData from "../../../models/PaymentData/PaymentData.js";
import User from "../../../models/User.js";

import mokaCreate3dPaymentRequest from "../mokaPayRequests/mokaCreate3dPaymentRequest.js";
import mokaRegisterCustomerRequest from "../mokaRegisterCardRequests/mokaCustomerRequests/mokaRegisterCustomerRequest.js";
import mokaGetCustomerRequest from "../mokaRegisterCardRequests/mokaCustomerRequests/mokaGetCustomerRequest.js";
import mokaRegisterCardRequest from "../mokaRegisterCardRequests/mokaCardRequests/mokaRegisterCard.js";

import mokaCheckifCardAlreadyRegisteredHelper from "../mokaHelpers/mokaCheckifCardAlreadyRegisteredHelper.js";

import crypto from "crypto";

const generateUniqueCode = () => {
    return crypto.randomBytes( 12 )
                 .toString('hex');
};

const validateCardData = (
    cardToken, 
    cardNumber, 
    cardExpiryMonth, 
    cardExpiryYear, 
    cardCvc, 
    paymentType
) => {
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
        throw new Error( "Missing Card or Payment Info" );
    }
};

const validateCustomer = ( customer ) => {
    if ( !customer ){
        throw new Error( "Customer Not Found" );
    }
};

const validateCustomerInfo = ( customer ) => {
    if (
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
        throw new Error( "Please Insert Your Phone & Email & Adress Firstly" );
    }
};

const mokaCreatePaymentHelper = async (
    customerUserId,
    cardToken,
    cardNumber,
    cardExpiryMonth,
    cardExpiryYear,
    cardCvc,
    parentContentId,
    productDesc,
    paymentType,
    extraTimeData,
    carGiverUserId,
    careGiverGuid,
    amount,
    redirectUrl,
    shouldRegisterCard,
    isFromInvitation
) => {
    try {
        if( !careGiverGuid ){
            return {
                error: true,
                serverStatus: -1,
                message: "CareGiverGuid is required"
            };
        }

        const paymentUniqueCode = generateUniqueCode();

        validateCardData(
            cardToken, 
            cardNumber, 
            cardExpiryMonth, 
            cardExpiryYear, 
            cardCvc, 
            paymentType
        );

        let payProcess;
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
        validateCustomer( customer );

        if( !cardToken ){
            if( !isCustomerRegistered ){
                validateCustomerInfo( customer );

                const phoneNumberWithoutZero = customer.phone
                                                       .replace(/\D/g, '')
                                                       .slice( -10 );

                const registerCustomer = await mokaRegisterCustomerRequest(
                    customerUserId,
                    customer.identity.firstName,
                    customer.identity.lastName,
                    phoneNumberWithoutZero,
                    customer.email,
                    customer.identity.openAdress
                );

                if(
                    !registerCustomer 
                    || registerCustomer.error 
                    || !registerCustomer.data
                                        .customerData
                                        .DealerCustomer
                                        .DealerCustomerId
                ){
                    return {
                        error: true,
                        serverStatus: -1,
                        message: "Error While Customer Registration"
                    };
                }
            }

            const isCardAlreadyRegistered = await mokaCheckifCardAlreadyRegisteredHelper(
                                                        customerUserId,
                                                        cardNumber
                                                  );

            if(
                shouldRegisterCard 
                && !isCardAlreadyRegistered.isCardAlreadyRegistered
            ){
                const cardName = `${customer.userName}_${customerUserId}_${crypto.randomBytes(3).toString('hex')}`;

                const registerCard = await mokaRegisterCardRequest(
                    customerUserId,
                    customer.identity.firstName,
                    customer.identity.middleName,
                    customer.identity.lastName,
                    cardNumber.replaceAll(" ", ""),
                    cardExpiryMonth,
                    cardExpiryYear,
                    cardName
                );

                if(
                    registerCard.error 
                    && registerCard.serverStatus === 0
                ){
                    return registerCard;
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
                    || !registeredCardInfo 
                    || !(
                        registerCard.data.customerData.CardList 
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
                    };
                }

                const cardDataToSave = {
                    cardName: registeredCardInfo.CardName,
                    cardGuid: registeredCardInfo.CardToken
                };

                customer.cardGuidies = customer.cardGuidies !== undefined 
                                            ? customer.cardGuidies.push( cardDataToSave ) 
                                            : customer.cardGuidies = [ cardDataToSave ];

                customer.markModified( "cardGuidies" );
            }
        }

        payProcess = await mokaCreate3dPaymentRequest(
            cardToken,
            customer.identity.firstName,
            customer.identity.middleName,
            customer.identity.lastName,
            cardNumber,
            cardExpiryMonth,
            cardExpiryYear,
            cardCvc,
            amount,
            paymentUniqueCode,
            paymentType,
            redirectUrl,
            careGiverGuid,
            30
        );

        if( payProcess.message === 'Daily Limit Exceeded' ){
            return payProcess
        }

        if (
            !payProcess 
            || payProcess.error 
            || !(
                payProcess.data.threeDPayData.Url 
                && payProcess.data.threeDPayData.CodeForHash
            )
        ){
            return {
                error: true,
                serverStatus: payProcess.serverStatus,
                message: payProcess.message
            };
        }

        const savedPaymentData = await new PaymentData(
            {
                paymentUniqueCode: paymentUniqueCode,
                subSellerId: carGiverUserId,
                customerId: customerUserId,
                subSellerGuid: careGiverGuid,
                priceData: {
                    price: amount,
                    extraTimeData: extraTimeData
                },
                parentContentId: parentContentId,
                productDesc: productDesc,
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
            message: "Payment Open Successfully",
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
            message: "Internal Server Error"
        };
    }
};

export default mokaCreatePaymentHelper;
