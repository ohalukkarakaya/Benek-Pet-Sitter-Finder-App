import Notification from "../../models/Notification.js";
import User from "../../models/User.js";
import Chat from "../../models/Chat/Chat.js";

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
                                                .limit( limit );

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

        //To Do: insert notification data helper

        return res.status( 200 )
                  .json(
                    {
                        error: false,
                        message: "Notification List Prepared Succesfully",
                        totalNotificationCount: totalNotificationCount,
                        notifications: notifications
                    }
                  );

        
    }catch( err ){
        console.log("ERROR: getPetByIdController - ", err);
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