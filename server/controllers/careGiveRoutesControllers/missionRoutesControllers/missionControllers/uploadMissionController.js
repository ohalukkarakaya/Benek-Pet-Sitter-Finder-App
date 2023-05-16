import sendNotification from "../../../../utils/notification/sendNotification.js";
import dotenv from "dotenv";

dotenv.config();

const uploadMissionController = async (req, res) => {
    try{
        const careGive = req.careGive;
        const mission = req.mission;
        const cdnUrl = req.cdnUrl;
        const fileName = req.missionContent;
        
        if(
            !careGive 
            || !mission 
            || !cdnUrl 
            || !fileName
        ){
            return res.status( 500 ).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }

        mission.missionContent
               .videoUrl = cdnUrl;

        careGive.markModified( "missionCallender" );

        careGive.save()
                .then(
                    async ( savedCareGive ) => {

                        await sendNotification(
                            savedCareGive.careGiver
                                         .careGiverId
                                         .toString(),
                            savedCareGive.petOwner
                                         .petOwnerId
                                         .toString(),
                            "missionUpload",
                            req.params
                               .missionId
                               .toString(),
                            "careGive",
                            savedCareGive._id
                                         .toString(),
                            null,
                            null,
                            null,
                            null
                        );

                        return res.status( 200 )
                                .json(
                                        {
                                            error: false,
                                            message: "Mission Content Uploaded",
                                            videoUrl: cdnUrl
                                        }
                                );
                    }
        ).catch(
            ( err ) => {
                if( err ){
                    console.log( err );
                    return res.status( 500 )
                              .json(
                                    {
                                        error: true,
                                        message: "Internal server error"
                                    }
                              );
                }
            }
        );
    }catch(err){
        console.log(err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default uploadMissionController;