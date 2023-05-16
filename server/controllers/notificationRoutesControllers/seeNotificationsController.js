import Notification from "../../models/Notification.js";

const seeNotificationsController = async ( req, res ) => {
    try{
        const userId = req.user
                          ._id
                          .toString();
        const notificationIdList = [...new Set( req.user._id.toString() )];
        if( 
            !notificationIdList 
            || notificationIdList.length <= 0
        ){
            return res.status( 400 )
                      .json(
                        {
                            error: true,
                            message: "Missing Param"
                        }
                      );
        }

        notificationIdList.forEach(
            async ( notificationId ) => {
                const notification = await Notification.findById( 
                                                            notificationId.toString() 
                                                        );

                notification.seenBy
                            .push( userId );

                notification.seenBy = [...new Set( notification.seenBy )];

                notification.markModified( "seenBy" );
                notification.save(
                    ( err ) => {
                        if(err) {
                            console.error('ERROR: While Update notification seenBy!');
                        }
                    }
                );
            }
        );

        return res.status( 200 )
                  .json(
                    {
                        error: false,
                        message: "Notifications seen succesfully"
                    }
                  );
    }catch( err ){
        console.log("ERROR: seeNotificationsController - ", err);
        res.status( 500 )
           .json(
                    {
                        error: true,
                        message: "Internal Server Error"
                    }
                );
    }
}

export default seeNotificationsController;