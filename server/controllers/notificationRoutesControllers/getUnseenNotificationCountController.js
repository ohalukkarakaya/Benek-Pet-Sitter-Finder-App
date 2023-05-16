import Notification from "../../models/Notification.js";

const getUnseenNotificationCountController = async ( req, res ) => {
    try{
        const userId = req.user
                          ._id
                          .toString()

        const notificationQuery = {
            $and: [
                {
                    to: { 
                        $in: [ userId ] 
                    }
                },
                {
                    seenBy: {
                        $nin: [ userId ]
                    }
                },
                {
                    openedBy: {
                        $nin: [ userId ]
                    }
                }
            ]
        };

        const totalNotificationCount= await Notification.countDocuments( notificationQuery );

        return res.status( 200 ).json(
            {
                error: false,
                message: "Notifications Counted Succesfully",
                unSeenNotificationCount: totalNotificationCount
            }
        );
    }catch( err ){
        console.log("ERROR: getUnseenNotificationCountController - ", err);
        res.status( 500 )
           .json(
                    {
                        error: true,
                        message: "Internal Server Error"
                    }
                );
    }
}

export default getUnseenNotificationCountController;