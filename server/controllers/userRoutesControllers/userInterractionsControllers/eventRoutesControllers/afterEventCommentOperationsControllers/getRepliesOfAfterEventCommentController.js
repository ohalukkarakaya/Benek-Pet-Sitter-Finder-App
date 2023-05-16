import Event from "../../../../../models/Event/Event.js";
import User from "../../../../../models/User.js";
import getLightWeightUserInfoHelper from "../../../../../utils/getLightWeightUserInfoHelper.js";

const getRepliesOfAfterEventCommentController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const eventId = req.params.eventId.toString();
        const afterEventId = req.params.contentId.toString();
        const commentId = req.params.commentId.toString();
        const skip = parseInt( req.params.skip ) || 0;
        const limit = parseInt( req.params.limit ) || 15;
        if(
            !eventId
            || !afterEventId
            || !commentId
        ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "Missing Params"
                }
            );
        }

        const searchedEvent = await Event.findById( eventId );
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
                    message: "Event not found"
                }
            );
        }

        const afterEvent = searchedEvent.afterEvent
                                        .find(
                                            afterEventObject =>
                                                afterEventObject._id
                                                                .toString() === afterEventId
                                        );
        if( !afterEvent ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "AfterEvent Not Found"
                }
            );
        }

        const comment = afterEvent.comments
                                  .find(
                                     commentObject =>
                                         commentObject._id
                                                      .toString() === commentId
                                   );
        if( !comment ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "Comment Not Found"
                }
            );
        }

        let replies;
        if( skip === 0 ){
            const usersReplies = comment.replies.filter(
                replyObject =>
                    replyObject.userId.toString() === userId
            );

            limit = limit - usersReplies.length;
            replies = usersReplies;
        }

        if( limit >= 0 ){
            const replyList = comment.replies
                                     .reverse()
                                     .filter(
                                        replyObject =>
                                            replyObject.userId.toString() !== userId
                                      );
            const startIndex = replyList.length - skip - 1;
            const endIndex = startIndex + limit;

            const limitedReplies = replyList.slice( startIndex, endIndex );

            replies.push( limitedReplies );
        }

        if( replies.length > 0 ){
            replies.forEach(
                async ( replyObject) => {
                    const repliedUser = await User.findById( replyObject.userId.toString() );
                    const repliedUserInfo = getLightWeightUserInfoHelper( repliedUser );
                    replyObject.user = repliedUserInfo;
                    delete replyObject.userId;

                    let firstFiveOfLikeLimit = 5;

                    if( replyObject.likes.length < 5 ){
                        firstFiveOfLikeLimit = replyObject.likes.length;
                    }

                    for( let i = 0; i <= firstFiveOfLikeLimit; i++ ){
                        const likedUser = await User.findById( replyObject.likes[ i ].toString() );
                        const likedUserInfo = getLightWeightUserInfoHelper( likedUser );
    
                        replyObject.firstFiveLikedUser.push( likedUserInfo );
                    }

                    const replyCount = commentObject.replies.length;
                    
                    replyObject.replyCount = replyCount;
                }
            );

            const usersReplies = replies.filter(
                replyObject =>
                    replyObject.user.userId === userId
            ).sort(
                ( a, b ) => 
                    b.createdAt - a.createdAt
            );

            const otherReplies = replies.filter(
                replyObject =>
                    replyObject.user.userId !== userId
            ).sort(
                ( a, b ) => 
                    b.createdAt - a.createdAt
            );

            const resultreplyData = [...usersReplies, ...otherReplies];
            return res.status( 200 ).json(
                {
                    error: false,
                    message: "reply Prepared succesfully",
                    replyCount: replies.length,
                    replies: resultreplyData
                }
            );
        }else{
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "No Comment Found"
                }
            );
        }
    }catch( err ){
        console.log("ERROR: getAfterEventListController - ", err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error",
            }
        );
    }
}

export default getRepliesOfAfterEventCommentController;