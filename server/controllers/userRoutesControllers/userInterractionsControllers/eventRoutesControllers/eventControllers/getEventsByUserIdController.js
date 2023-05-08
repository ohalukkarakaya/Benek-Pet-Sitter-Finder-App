import Event from "../../../../../models/Event/Event.js";
import User from "../../../../../models/User.js";

const getEventsByUserIdController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString()
        const events = await Event.find(
            {
                $or: [
                    {
                        eventAdmin: userId
                    },
                    {
                        eventOrganizers: {
                            $in: [
                                userId
                            ]
                        }
                    },
                    {
                        willJoin: {
                            $in: [
                                userId
                            ]
                        }
                    },
                    {
                        joined: {
                            $in: [
                                userId
                            ]
                        }
                    }
                ]
            }
        );
        if( events.length <= 0 ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "No Event Found"
                }
            );
        }

        events.forEach(
            async ( releatedEvent ) => {

                releatedEvent.willJoin
                             .forEach(
                                async ( willJoinUserId ) => {

                                    const willJoinUser = await User.findById( willJoinUserId );
                                    const willJoinUserInfo = {

                                        userId: willJoinUser._id
                                                            .toString(),

                                        userProfileImg: willJoinUser.profileImg
                                                                    .imgUrl,

                                        username: willJoinUser.userName,

                                        userFullName: `${
                                                willJoinUser.identity
                                                            .firstName
                                            } ${
                                                willJoinUser.identity
                                                            .middleName
                                            } ${
                                                willJoinUser.identity
                                                            .lastName
                                            }`.replaceAll( "  ", " ")
                                    }
                    
                                    releatedEvent.willJoinUserList
                                                .push( willJoinUserInfo );
                                }
                             );
        
                if( 
                    releatedEvent.willJoinUserList
                                 .length === releatedEvent.willJoin
                                                          .length 
                ){
                    delete releatedEvent.willJoinUserList;
                }

                releatedEvent.joined
                             .forEach(
                                async ( joinedUserId ) => {
                                    const joinedUser = await User.findById( joinedUserId );
                                    const joinedUserInfo = {

                                        userId: joinedUser._id
                                                          .toString(),

                                        userProfileImg: joinedUser.profileImg
                                                                  .imgUrl,

                                        username: joinedUser.userName,

                                        userFullName: `${
                                                joinedUser.identity
                                                          .firstName
                                            } ${
                                                joinedUser.identity
                                                          .middleName
                                            } ${
                                                joinedUser.identity
                                                          .lastName
                                            }`.replaceAll( "  ", " ")
                                    }
                    
                                    releatedEvent.joinedUserList
                                                 .push( joinedUserInfo );
                                }
                             )
        
                if( 
                    releatedEvent.joinedUserList
                                 .length === releatedEvent.joined
                                                          .length 
                ){
                    delete releatedEvent.joined;
                }

                const eventAdmin = await User.findById( 
                                                        releatedEvent.eventAdmin
                                                                    .toString() 
                                                     );
                if( 
                    !eventAdmin 

                    || eventAdmin.deactivation
                                 .isDeactive
                ){
                    return res.status( 404 ).json(
                        {
                            error: true,
                            message: "Event not found"
                        }
                    );
                }

                const eventAdminUserInfo = {

                    userId: eventAdmin._id
                                      .toString(),

                    userProfileImg: eventAdmin.profileImg
                                              .imgUrl,

                    username: eventAdmin.userName,

                    userFullName: `${
                            eventAdmin.identity
                                      .firstName
                        } ${
                            eventAdmin.identity
                                      .middleName
                        } ${
                            eventAdmin.identity
                                      .lastName
                        }`.replaceAll( "  ", " ")
                }

                releatedEvent.eventAdmin = eventAdminUserInfo;

                releatedEvent.eventOrganizers.forEach(
                    async ( organizerId ) => {
                        const organizer = await User.findById( organizerId );
                        const organizerInfo = {
        
                            userId: organizer._id
                                             .toString(),
        
                            userProfileImg: organizer.profileImg
                                                     .imgUrl,
        
                            username: organizer.userName,
        
                            userFullName: `${
                                    organizer.identity
                                             .firstName
                                } ${
                                    organizer.identity
                                             .middleName
                                } ${
                                    organizer.identity
                                             .lastName
                                }`.replaceAll( "  ", " ")
                        }
        
                        releatedEvent.organizerList
                                     .push( organizerInfo );
                    }
                );

                if( 
                    releatedEvent.eventOrganizers
                                 .length ===  releatedEvent.organizerList
                                                           .length 
                ){
                    delete releatedEvent.eventOrganizers;
                }

                if( 
                    releatedEvent.afterEvent
                                 .length > 0 
                ){

                    const lastAfterEventObject = releatedEvent.afterEvent[ 
                                                                            releatedEvent.afterEvent
                                                                                         .length -1 
                                                                         ];
                    delete lastAfterEventObject.comments;
        
                    lastAfterEventObject.likes
                                        .forEach(
                                            async ( likedUserId ) => {
                                                const likedUser = await User.findById( 
                                                                                likedUserId.toString() 
                                                                            );
                                                const likedUserInfo = {
                            
                                                    userId: likedUser._id
                                                                     .toString(),
                                
                                                    userProfileImg: likedUser.profileImg
                                                                             .imgUrl,
                                
                                                    username: likedUser.userName,
                                
                                                    userFullName: `${
                                                            likedUser.identity
                                                                     .firstName
                                                        } ${
                                                            likedUser.identity
                                                                     .middleName
                                                        } ${
                                                            likedUser.identity
                                                                     .lastName
                                                        }`.replaceAll( "  ", " ")
                                                }
                            
                                                lastAfterEventObject.likedUsers
                                                                    .push( likedUserInfo );
                                            }
                                        );
        
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
                    const afterEventContentCreaterInfo = {
        
                        userId: afterEventContentCreater._id
                                                        .toString(),
        
                        userProfileImg: afterEventContentCreater.profileImg
                                                                .imgUrl,
        
                        username: afterEventContentCreater.userName,
        
                        userFullName: `${
                                afterEventContentCreater.identity
                                                        .firstName
                            } ${
                                afterEventContentCreater.identity
                                                        .middleName
                            } ${
                                afterEventContentCreater.identity
                                                        .lastName
                            }`.replaceAll( "  ", " ")
                    }
        
                    lastAfterEventObject.user = afterEventContentCreaterInfo;
                    delete lastAfterEventObject.userId;
        
                    releatedEvent.afterEvent = lastAfterEventObject;
                }
            }
        );

        return res.status( 200 ).json(
            {
                error: false,
                message: "List of Events Which Releated to You Had Prepared Successfully",
                events: events
            }
        );
        
    }catch( err ){
        console.log("ERROR: getEventsByUserIdController - ", err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default getEventsByUserIdController;