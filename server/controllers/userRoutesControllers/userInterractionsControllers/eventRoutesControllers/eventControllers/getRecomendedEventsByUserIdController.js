import Event from "../../../../../models/Event/Event.js";
import User from "../../../../../models/User.js";
import getLightWeightUserInfoHelper from "../../../../../utils/getLightWeightUserInfoHelper.js";

const getRecomendedEventsByUserIdController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();

        const user = await User.findById( userId );
        if( !user ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "User Not Found"
                }
            );
        }

        let recomendedEvents;
        user.followingUsersOrPets.forEach(
            async ( followingUserObject ) => {
                if( 
                    followingUserObject.type === "user" 
                ){
                    const eventsReleatedToFollowingUser = await Event.find(
                        {
                            $or: [
                                {
                                    eventAdmin: followingUserObject.followingId
                                },
                                {
                                    eventOrganizers: { $in: followingUserObject.followingId }
                                },
                                {
                                    willJoin: { $in: followingUserObject.followingId }
                                }
                            ]
                        }
                    );

                    eventsReleatedToFollowingUser.forEach(
                        async ( releatedEvent ) => {

                           releatedEvent.willJoin
                                        .forEach(
                                            async ( willJoinUserId ) => {

                                                const willJoinUser = await User.findById( 
                                                                                    willJoinUserId 
                                                                                );
                                                const willJoinUserInfo = getLightWeightUserInfoHelper(
                                                                                            willJoinUser
                                                                        );
                                
                                                releatedEvent.willJoinUserList
                                                             .push( willJoinUserInfo );
                                            }
                                        );
                    
                            if( 
                                releatedEvent.willJoinUserList
                                             .length === releatedEvent.willJoin
                                                                      .length 
                            ){
                                delete releatedEvent.willJoin;
                            }

                            releatedEvent.joined
                                        .forEach(
                                            async ( joinedUserId ) => {
                                                const joinedUser = await User.findById( 
                                                                                joinedUserId 
                                                                              );
                                                const joinedUserInfo = getLightWeightUserInfoHelper(
                                                                                            joinedUser
                                                                       );
                                
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

                            const eventAdminUserInfo = getLightWeightUserInfoHelper( eventAdmin );

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

                                const lastAfterEventObject = releatedEvent.afterEvent.pop();
                                delete lastAfterEventObject.comments;
                    
                                lastAfterEventObject.likes
                                                    .forEach(
                                                        async ( likedUserId ) => {
                                                            const likedUser = await User.findById( 
                                                                                            likedUserId.toString() 
                                                                                        );
                                                            const likedUserInfo = getLightWeightUserInfoHelper( likedUser );
                                        
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
                                delete releatedEvent.eventAdminsParamGuid;

                                const connectedUser = await User.findById( followingUserObject.followingId.toString() );
                                const connectedUserInfo = getLightWeightUserInfoHelper( connectedUser );
                                
                                releatedEvent.releatedUser = connectedUserInfo;

                                const isReleatedEventAlreadyInserted = recomendedEvents.filter(
                                    recomendEventObject =>
                                            recomendEventObject._id.toString() === releatedEvent._id.toString()
                                );

                                if( !isReleatedEventAlreadyInserted ){
                                    recomendedEvents.push( releatedEvent );
                                }
                            }

                        }
                    );
                }
            }
        )

        return res.status( 200 ).json(
            {
                error: false,
                message: "List of Recomended Events Which Releated to Users who You Follow Had Prepared Successfully",
                recomendedEvents: recomendedEvents
            }
        );
    }catch( err ){
        console.log("ERROR: getRecomendedEventsByUserIdController - ", err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default getRecomendedEventsByUserIdController;