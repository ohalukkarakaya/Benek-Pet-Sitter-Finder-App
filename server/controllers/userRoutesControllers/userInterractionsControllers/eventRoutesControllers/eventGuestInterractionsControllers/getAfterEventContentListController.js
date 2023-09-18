import Event from "../../../../../models/Event/Event.js";
import User from "../../../../../models/User.js";

import getLightWeightUserInfoHelper from "../../../../../utils/getLightWeightUserInfoHelper.js";

const getAfterEventContentListController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const eventId = req.params.eventId.toString();
        const skip = parseInt( req.params.skip ) || 0;
        const limit = parseInt( req.params.limit ) || 15;
        if( !eventId ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "Missing Params"
                }
            );
        }

        const meetingEvent = await Event.findById( eventId );
        var searchedEvent = await Event.findById( eventId )
                                       .select( 'afterEvent' )
                                       .slice( 'afterEvent', [ skip, limit ] )
                                       .lean()
                                       .exec();

        if(
            !meetingEvent 
            || (
                meetingEvent.isPrivate 
                && !(
                        meetingEvent.eventAdmin === userId 
                        || meetingEvent.eventOrganizers
                                       .includes( userId ) 
                        || meetingEvent.willJoin
                                       .includes( userId ) 
                        || meetingEvent.joined
                                       .includes( userId )
                    )
            )
        ){
            return res.status( 404 )
                      .json(
                         {
                            error: true,
                            message: "Event Not Found"
                         }
                       );
        }

        const promises = searchedEvent.afterEvent
                                      .map(
            async ( afterEventObject ) => {
                const lastComment = afterEventObject.comments 
                                        ? afterEventObject.comments
                                                          .pop() 
                                        : null;

                const commentCount = afterEventObject.comments 
                                        ? afterEventObject.comments
                                                          .length 
                                        : 0;

                if( lastComment ){
                    lastComment.replyCount = lastComment.replies 
                                                ? lastComment.replies
                                                             .length 
                                                : 0;
                                                
                    if( lastComment.replies ) delete lastComment.replies;
                }

                const sharedUser = await User.findById( afterEventObject.userId );
                const sharedUserInfo = getLightWeightUserInfoHelper( sharedUser );

                const firstFiveUserLimit = Math.min(
                                                    afterEventObject.likes
                                                                    .length, 
                                                    5
                                                );
                                                
                const likedUsers = await Promise.all(
                    afterEventObject.likes
                                    .slice(
                                        0, 
                                        firstFiveUserLimit
                                    ).map(
                                        async ( userId ) => {
                                            const likedUser = await User.findById( userId.toString() );
                                            return getLightWeightUserInfoHelper( likedUser );
                                        }
                                    )
                );

                delete afterEventObject.userId;
      
                return {
                    ...afterEventObject,
                    lastComment,
                    commentCount,
                    firstFiveLikedUser: likedUsers,
                    user: sharedUserInfo
                };
          }
        );

        const afterEventContents = await Promise.all( promises );

        return res.status( 200 )
                  .json(
                        {
                            error: false,
                            message: "After event contents prepared successfully",
                            data: {
                                eventId,
                                totalAfterEventCount: meetingEvent.afterEvent.length,
                                afterEventContents
                            }
                        }
                   );
    }catch( err ){
        console.log("ERROR: getAfterEventListController - ", err);
        res.status( 500 )
           .json(
                {
                    error: true,
                    message: "Internal Server Error",
                }
            );
    }
}

export default getAfterEventContentListController;