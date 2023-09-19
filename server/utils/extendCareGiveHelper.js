import CareGive from "../models/CareGive/CareGive.js";
import User from "../models/User.js";

import dotenv from "dotenv";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const rawPricingDataset = require('../src/care_give_pricing.json');
const pricingDataset = JSON.parse(JSON.stringify(rawPricingDataset));

dotenv.config();

const extendCareGiveHelper = async (
    careGiveId,
    priceData
) => {
    try{
        const careGive = await CareGive.findById( careGiveId );
        if( !careGive ){
            return {
                error: true,
                serverStatus: -1,
                message: "Care Give Not Found"
            };
        }

        let miliSecToCountEndDate = eval( priceData.extraTimeData );
        const endDateToSave = new Date( careGive.endDate.getTime() + miliSecToCountEndDate );

        careGive.prices.servicePrice = careGive.prices.servicePrice + priceData.price;
        careGive.endDate = endDateToSave;

        careGive.markModified( "prices" );
        careGive.markModified( "endDate" );

        const newCareGive = await careGive.save();
        return {
            error: false,
            serverStatus: 1,
            message: `Care Give Extended Successfully`,
            payData: null,
            ticketId: newCareGive._id.toString()
        };
    }catch( err ){
        console.log( "ERROR: extendCareGiveHelper - ", err );
        return {
            error: true,
            serverStatus: -1,
            message: "Internal Server Error"
        };
    }
};

export default extendCareGiveHelper;