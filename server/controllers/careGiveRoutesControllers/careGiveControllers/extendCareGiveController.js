import CareGive from "../../../models/CareGive/CareGive.js";

import mokaCreatePaymentHelper from "../../../utils/mokaPosRequests/mokaHelpers/mokaCreatePaymentHelper.js";

import dotenv from "dotenv";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const rawPricingDataset = require('../../../src/care_give_pricing.json');
const pricingDataset = JSON.parse(JSON.stringify(rawPricingDataset));

dotenv.config();

const extendCareGiveController = async (req, res) => {
    try{
        const careGiveId = req.params.careGiveId;
        const price = req.body.price;
        if( !careGiveId ){
            return res.status( 400 )
                      .json(
                           {
                               error: true,
                               message: "Missing params"
                           }
                       );
        }
        if(
            !price 
            || !price.petTypeCode 
            || !price.serviceTypeCode 
            || !price.type 
        ){
            return res.status( 400 )
                      .json(
                          {
                              error: true,
                              message: "In valid price model"
                          }
                      );
        }

        const careGive = await CareGive.findById( careGiveId );
        if( !careGive ){
            return res.status( 404 )
                      .json(
                           {
                               error: true,
                               message: "Care Give Not Found"
                           }
                       );
        }
        if( careGive.prices.priceType !== price.type ){
            return res.status( 400 )
                      .json(
                           {
                               error: true,
                               message: "Invalid product"
                           }
                       );
        }

        const petTypePricingModel = pricingDataset.prices
                                                  .find(
                                                       pricingObject =>
                                                           pricingObject.id === price.petTypeCode
                                                   );
        if( !petTypePricingModel ){
            return res.status( 404 )
                      .json(
                           {
                               error: true,
                               message: "pricing pet type model not found"
                           }
                       );
        }
        const pricing = petTypePricingModel.servicePackages
                                           .find(
                                                petTypeObject =>
                                                    petTypeObject.id === price.serviceTypeCode
                                            );
        if( !pricing ){
            return res.status( 404 )
                      .json(
                           {
                               error: true,
                               message: "pricing not found"
                           }
                       );
        }

        let miliSecToCountEndDate = pricing.priceData.milisecondsToAdd;

        const cardGuid = req.body.cardGuid 
                            ? req.body.cardGuid.toString() 
                            : null;

        const cardNo = req.body.cardNo.toString();
        const cvv = req.body.cvc.toString();
        const cardExpiryDate = req.body.cardExpiryDate.toString();
        const userId = req.user._id.toString();
        const priceToPay = parseFloat( pricing.priceData.servicePrice[ price.type ] );

        const redirectUrl = process.env.BASE_URL + "/api/paymentRedirect";

        const paymentData = await mokaCreatePaymentHelper(
            userId, //customer user id
            cardGuid, //card guid
            cardNo, //card number
            cardExpiryDate.split("/")[0], //card expiry month
            cardExpiryDate.split("/")[1], //card expiry year
            cvv, //card cvv
            careGive._id.toString(), //parent id
            "CareGiveExtension", //payment type
            miliSecToCountEndDate, //extension data
            careGive.careGiver.careGiverId, //caregiver id
            careGive.invitation.careGiverPosGuid, //caregiver guid
            priceToPay, // amount
            redirectUrl,
            req.body.recordCard === 'true',
            false // is from invitation
        );

        if( paymentData.message === 'Daily Limit Exceeded' ){
            return res.status( 500 )
                        .json(
                        {
                            error: true,
                            message: "CareGiver Daily Limit Exceeded",
                            payError: paymentData
                        }
                        );
        }

        if(
            !paymentData 
            || paymentData.error 
            || paymentData.serverStatus !== 1 
            || !paymentData.payData 
            || paymentData.payData === null 
            || paymentData.payData === undefined
        ){
            return res.status( 500 )
                        .json(
                        {
                            error: true,
                            message: "Error While Payment",
                            payError: paymentData
                        }
                        );
        }

        return res.status( 200 )
                    .json(
                        {
                            error: false,
                            message: "Waiting for 3d payment approve",
                            payData: paymentData.payData
                        }
                    );
    }catch( err ){
        console.log( "ERROR: finish care give", err );

        return res.status( 500 )
                  .json(
                       {
                           error: true,
                           message: "Internal server error"
                       }
                   );
    }
}

export default extendCareGiveController;