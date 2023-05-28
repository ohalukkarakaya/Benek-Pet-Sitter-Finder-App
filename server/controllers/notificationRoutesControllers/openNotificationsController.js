import Notification from "../../models/Notification.js";

const openNotificationsController = async ( req, res ) => {
    try{
        const userId = req.user
                          ._id
                          .toString();
        const notificationIdList = [...new Set( req.body.notificationIdList )];
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

        for(
            let notificationId
            of notificationIdList
        ){
            const notification = await Notification.findById( 
                                                            notificationId.toString() 
                                                        );
            if( notification ){

                notification.openedBy
                            .push( userId );

                notification.openedBy = [...new Set( notification.openedBy )];

                if(
                    notification.openedBy
                                .length === notification.to
                                                        .length
                ){
                    notification.deleteOne().then()
                                            .catch(
                                                (error) => {
                                                    console.log( error );
                                                    return res.status( 500 )
                                                            .json(
                                                                    {
                                                                        error: true,
                                                                        message: "Internal server error"
                                                                    }
                                                            );
                                                }
                                            );
                }else{
                    notification.markModified( "openedBy" );
                    notification.save(
                        ( err ) => {
                            if(err) {
                                console.error('ERROR: While Update notification seenBy!');
                            }
                        }
                    );
                }
                
            }

        }

        return res.status( 200 )
                  .json(
                    {
                        error: false,
                        message: "Notifications opened succesfully"
                    }
                  );
    }catch( err ){
        console.log("ERROR: openNotificationsController - ", err);
        res.status( 500 )
           .json(
                    {
                        error: true,
                        message: "Internal Server Error"
                    }
                );
    }
}

export default openNotificationsController;