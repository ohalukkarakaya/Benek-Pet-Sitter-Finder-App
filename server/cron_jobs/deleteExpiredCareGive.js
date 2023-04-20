import cron from "node-cron";
import CareGive from "../models/CareGive/CareGive.js";
import ReportedMission from "../models/report/ReportMission.js";
import s3 from "../utils/s3Service.js";

import paramAproveOrderRequest from "../utils/paramRequests/paymentRequests/paramAproveOrderRequest.js";

import dotenv from "dotenv";

dotenv.config();

const expireCareGive = cron.schedule(
    '0 0 0 * * *',
    async () => {
        try{
            const expiredCareGives = await CareGive.find(
                careGiveObject =>
                    careGiveObject.finishProcess.isFinished === true
                    && careGiveObject.finishProcess.finishDate <= Date.now() + 604800000
            );
            expiredCareGives.map(
                async (careGive) => {
                    const isCareGiveReported = await ReportedMission.find(
                        reportedMissionObject =>
                            reportedMissionObject.careGiveId
                                                 .toString() === careGive._id
                                                                         .toString()
                    );
                    if( !isCareGiveReported ){
                        //delete images of event
                        async function emptyS3Directory(bucket, dir){
                            const listParams = {
                                Bucket: bucket,
                                Prefix: dir
                            };
                            const listedObjects = await s3.listObjectsV2(listParams);
                            if (listedObjects.Contents.length === 0) return;
                            const deleteParams = {
                                Bucket: bucket,
                                Delete: { Objects: [] }
                            };
        
                            listedObjects.Contents.forEach(({ Key }) => {
                                deleteParams.Delete.Objects.push({ Key });
                            });
                            await s3.deleteObjects(deleteParams);
                            if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
                        }
                        emptyS3Directory(
                            process.env.BUCKET_NAME, 
                            `careGive/${careGive._id.toString()}/`
                        ).then(
                            async (_) => {

                                if( careGive.prices.priceType !== "Free" && careGive.prices.servicePrice !== 0 ){
                                    //approve payments
                                    const approveCareGivePayment = await paramAproveOrderRequest(
                                        careGive.prices.orderInfo.pySiparisGuid
                                    );
                                    if( !approveCareGivePayment || approveCareGivePayment.error === true ){
                                        console.log( approveCareGivePayment.sonucStr );
                                    }
                                }

                                for( var mission in careGive.missionCallender ){
                                    if( mission.isExtra && mission.extraMissionInfo && mission.extraMissionInfo.paidPrice ){
                                        //approve extra mission payments
                                        const approveCareGivePayment = await paramAproveOrderRequest(
                                            mission.extraMissionInfo.pySiparisGuid
                                        );
                                        if( !approveCareGivePayment || approveCareGivePayment.error === true ){
                                            console.log( approveCareGivePayment.sonucStr );
                                        }
                                    }
                                }

                                //delete CareGive
                                careGive.deleteOne().then(
                                    (_) => {
                                        console.log("deleted an expired Care Give");
                                    }
                                ).catch(
                                    (error) => {
                                        console.log(error);
                                    }
                                );
                            }
                        );
                    }
                }
            );
        }catch(err){
            console.log(err);
        }
    }
);

export default expireCareGive;