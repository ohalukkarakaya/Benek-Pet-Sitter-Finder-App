import getLightWeightUserInfoHelper from "./getLightWeightUserInfoHelper.js";

const getLightWeightEventInfoHelper = async ( event ) => {
    try{
        let willJoinList = [];
        for(
            let willJoinUserId
            of event.willJoin
        ){
            const willJoinUser = await User.findById( willJoinUserId );
            const willJoinUserInfo = getLightWeightUserInfoHelper( willJoinUser );

            willJoinList.push( willJoinUserInfo );
        }

        let joinedList = [];
        for(
            let joinedUserId
            of event.joined
        ){
            const joinedUser = await User.findById( joinedUserId );
            const joinedUserInfo = getLightWeightUserInfoHelper( joinedUser );
            joinedList.push( joinedUserInfo );
        }

        let organizersList = [];
        for(
            let organizerId
            of event.eventOrganizers
        ){
            const organizer = await User.findById( organizerId );
            const organizerInfo = getLightWeightUserInfoHelper( organizer );
            organizersList.push( organizerInfo );
        }

        const eventAdmin = await User.findById( 
                                        event.eventAdmin
                                             .toString() 
                                      );
        const eventAdminInfo = getLightWeightUserInfoHelper( eventAdmin );

        let lastAfterEventObject;
        if( 
            event.afterEvent
                 .length > 0 
        ){
            lastAfterEventObject = event.afterEvent
                                              .pop();
                                    
            delete lastAfterEventObject.comments;
            for(
                let likedUserId
                of lastAfterEventObject.likes
            ){

                const likedUser = await User.findById( likedUserId.toString() );
                const likedUserInfo = getLightWeightUserInfoHelper( likedUser );

                lastAfterEventObject.likedUsers
                                    .push( likedUserInfo );
            }

            if( 
                lastAfterEventObject.likedUsers
                                    .length === lastAfterEventObject.likes
                                                                    .length 
            ){
                delete lastAfterEventObject.likes;
            }

            const afterEventContentCreater = await User.findById( 
                                                            lastAfterEventObject.userId
                                                                                .toString() 
                                                        );

            const afterEventContentCreaterInfo = getLightWeightUserInfoHelper( afterEventContentCreater );
            lastAfterEventObject.user = afterEventContentCreaterInfo;
            delete lastAfterEventObject.userId;
        }

        return {
            eventId: event._id.toString(),
            eventAdmin: eventAdminInfo,
            organizers: organizersList,
            willJoin: willJoinList,
            joined: joinedList,
            lastAfterEvent: lastAfterEventObject
        };
    }catch( err ){
        console.log( "ERROR: event lightweight info - ", err );
        return err;
    }
}

export default getLightWeightEventInfoHelper;