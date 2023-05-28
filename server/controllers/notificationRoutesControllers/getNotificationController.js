import Notification from "../../models/Notification.js";

import prepareNotificationHelper from "../../utils/notification/prepareNotificationHelper.js";

const getNotificationController = async ( req, res ) => {
    try{
        const userId = req.user
                          ._id
                          .toString();

        const skip = parseInt(
                        req.params
                           .skip
                     ) || 0;

        const limit = parseInt(
                        req.params
                           .limit
                      ) || 15;


        const notificationQuery = {
            $and: [
                {
                    to: { 
                        $in: [ userId ] 
                    }
                },
                {
                    openedBy: {
                        $nin: [ userId ]
                    }
                }
            ]
        };

        const notifications = await Notification.find( notificationQuery )
                                                .skip( skip )
                                                .limit( limit )
                                                .lean();

         const totalNotificationCount= await Notification.countDocuments( notificationQuery );

        if( 
            !notifications
            || notifications.length <= 0
        ){
            return res.status( 404 )
                      .json(
                        {
                            error: true,
                            message: "No Notification Found"
                        }
                      );
        }

        const preparedNotificationData = await prepareNotificationHelper( notifications );
        if( 
            preparedNotificationData.error
        ){
            return res.status( 500 )
                      .json(
                        {
                            error: true,
                            message: "Internal Server Error"
                        }
                      );
        }

        return res.status( 200 )
                  .json(
                    {
                        error: false,
                        message: "Notification List Prepared Succesfully",
                        totalNotificationCount: totalNotificationCount,
                        notifications: preparedNotificationData
                    }
                  );

        
    }catch( err ){
        console.log("ERROR: getNotificationController - ", err);
        res.status( 500 )
           .json(
                {
                    error: true,
                    message: "Internal Server Error"
                }
            );
    }
}

export default getNotificationController;