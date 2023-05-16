import CareGive from "../../../models/CareGive/CareGive.js";
import dotenv from "dotenv";
import { createRequire } from "module";

import recordLog from "../../../utils/logs/recordLog.js";

const require = createRequire(import.meta.url);
const rawPricingDataset = require('../../../src/care_give_pricing.json');
const pricingDataset = JSON.parse(JSON.stringify(rawPricingDataset));

dotenv.config();

const extendCareGiveController = async (req, res) => {
    try{
        const careGiveId = req.params.careGiveId;
        const price = req.body.price;

        if(!careGiveId){
            return res.status(400).json(
                {
                    error: true,
                    message: "Missing params"
                }
            );
        }
        if( !price || !price.petTypeCode || !price.serviceTypeCode || !price.type ){
            return res.status(400).json(
                {
                    error: true,
                    message: "In valid price model"
                }
            );
        }

        const careGive = await CareGive.findById(careGiveId);
        if(!careGive){
            return res.status(404).json(
                {
                    error: true,
                    message: "Care Give Not Found"
                }
            );
        }
        if(careGive.prices.priceType !== price.type){
            return res.status(400).json(
                {
                    error: true,
                    message: "Invalid product"
                }
            );
        }

        const petTypePricingModel = pricingDataset.find(
            pricingObject =>
                pricingObject.id === price.petTypeCode
        );
        if(!petTypePricingModel){
            return res.status(404).json(
                {
                    error: true,
                    message: "pricing pet type model not found"
                }
            );
        }
        const pricing = petTypePricingModel.servicePackages.find(
            petTypeObject =>
                petTypeObject.id === price.serviceTypeCode
        );
        if(!pricing){
            return res.status(404).json(
                {
                    error: true,
                    message: "pricing not found"
                }
            );
        }

        careGive.prices.servicePrice = careGive.prices.servicePrice + pricing.servicePrice[price.type];
        careGive.endDate = new Date(Date.parse(careGive.endDate) + pricing.milisecondsToAdd );
        careGive.markModified("prices");
        careGive.markModified("endDate");
        careGive.save()
                .then(
                    async ( careGive ) => {

                        await recordLog(
                            req.user._id.toString(),
                            false,
                            null,
                            "extendCareGiveController",
                            next
                        );

                        return res.status( 200 )
                                .json(
                                    {
                                        error: false,
                                        message: "CareGive extended succesfully",
                                        newEndDate: new Date(careGive.endDate)
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
    }catch(err){
        console.log("ERROR: finish care give", err);

        await recordLog(
            req.user._id.toString(),
            true,
            err.message,
            "extendCareGiveController",
            next
        );

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