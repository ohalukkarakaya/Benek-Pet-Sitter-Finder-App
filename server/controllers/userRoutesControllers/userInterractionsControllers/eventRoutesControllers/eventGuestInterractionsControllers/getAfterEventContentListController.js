import Event from "../../../../../models/Event/Event.js";
import User from "../../../../../models/User.js";

import getLightWeightUserInfoHelper from "../../../../../utils/getLightWeightUserInfoHelper.js";

import mongoose from "mongoose";

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

        const eventAdminsAfterEventContents = searchedEvent.afterEvent
                                                           .filter(
                                                                afterEventObject =>
                                                                    afterEventObject.userId
                                                                                    .toString() === searchedEvent.eventAdmin
                                                            ).sort(
                                                                ( a, b ) => 
                                                                    b.createdAt - a.createdAt
                                                              );

        const eventWithUsersAfterEvent = searchedEvent.afterEvent
                                                      .filter(
                                                        afterEventObject =>
                                                            afterEventObject.userId
                                                                            .toString() === userId
                                                       ).sort(
                                                         ( a, b ) => 
                                                             b.createdAt - a.createdAt
                                                       );

        const afterEvventsWithoutUsers = searchedEvent.afterEvent
                                                      .filter(
                                                        afterEventObject =>
                                                            afterEventObject.userId
                                                                            .toString() !== searchedEvent.eventAdmin
                                                            && afterEventObject.userId
                                                                               .toString() !== userId
                                                       ).sort(
                                                            ( a, b ) => 
                                                                b.createdAt - a.createdAt
                                                       );

        const startIndex = skip > 0
                            ? skip - 1
                            : skip;
        const endIndex = startIndex + ( limit - 1 );

        const totalList = [ 
                            ...eventAdminsAfterEventContents, 
                            ...eventWithUsersAfterEvent, 
                            ...afterEvventsWithoutUsers 
                          ];

        searchedEvent.afterEvent = totalList.slice( startIndex, endIndex );


        if(
            !searchedEvent 
            || (
                searchedEvent.isPrivate
                && (
                    searchedEvent.eventAdmin !== userId
                    && !(
                            searchedEvent.eventOrganizers
                                         .includes( userId )
                        )
                    && !(
                        searchedEvent.willJoin
                                     .includes( userId )
                       )
                    && !(
                        searchedEvent.joined
                                     .includes( userId )
                       )
                )
            )
        ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "Event Not Found"
                }
            );
        }

        for(
            let afterEventObject
            of searchedEvent.afterEvent
        ){
            var lastComment = afterEventObject.comments
                                ? afterEventObject.comments.pop()
                                : null;

            const commentCount = afterEventObject.comments
                                    ? afterEventObject.comments.length
                                    : 0;

            if( lastComment ){
                lastComment.replyCount =  lastComment
                                          && lastComment.replies
                                                ? lastComment.replies.length
                                                : 0;
            }
            

            if( 
                lastComment
                && lastComment.replies 
            ){
                delete lastComment.replies;
            }
            
            afterEventObject.lastComment = lastComment;
            afterEventObject.commentCount = commentCount;

            if( afterEventObject.comments ){
                delete afterEventObject.comments;
            }
            

            const sharedUser = await User.findById( afterEventObject.userId );
            const sharedUserInfo = getLightWeightUserInfoHelper( sharedUser );

            afterEventObject.firstFiveLikedUser = [];
            afterEventObject.user = sharedUserInfo;
            delete afterEventObject.userId;

            let firstFiveUserLimit = afterEventObject.likes
                                                     .length > 5
                                        ? 5
                                        : afterEventObject.likes
                                                          .length - 1; 
            for( 
                let i = 0; 
                i <= firstFiveUserLimit; 
                i++ 
            ){
                const likedUser = await User.findById( 
                                                afterEventObject.likes[ i ]
                                                                .toString() 
                                             );
                                             
                const likedUserInfo = getLightWeightUserInfoHelper( likedUser );

                afterEventObject.firstFiveLikedUser
                                .push( likedUserInfo );
            }
        }

        return res.status( 200 )
                  .json(
                        {
                            error: false,
                            message: "After event contents prepared succesfully",
                            data: {
                                eventId: eventId,
                                totalAfterEventCount: meetingEvent.afterEvent.length,
                                afterEventContents: searchedEvent.afterEvent
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