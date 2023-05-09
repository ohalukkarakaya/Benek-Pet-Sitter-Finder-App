import Event from "../../../../../models/Event/Event.js";
import User from "../../../../../models/User.js";

const getAfterEventCommentsController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const eventId = req.params.eventId.toString();
        const afterEventId = req.params.contentId.toString();
        let skip = parseInt( req.params.skip ) || 0;
        let limit = parseInt( req.params.limit ) || 15;
        if(
            !eventId
            || !afterEventId
        ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "Missing Param"
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
                    message: "Event Not Found"
                }
            );
        }

        const afterEvent = searchedEvent.afterEvent.find(
            afterEventObject =>
                afterEventObject._id.toString() === afterEventId
        );
        if( !afterEvent ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "AfterEvent Not Found"
                }
            );
        }

        let comments;
        if( skip = 0 ){
            const usersComments = afterEvent.comments.filter(
                commentObject =>
                    commentObject.userId.toString() === userId
            );

            limit = limit - usersComments.length;
            comments = usersComments;
        }

        if( limit >= 0 ){
            const commentList = afterEvent.comments
                                          .reverse()
                                          .filter(
                                            commentObject =>
                                                commentObject.userId.toString() !== userId
                                          );
            const startIndex = commentList.length - skip - 1;
            const endIndex = startIndex + limit;

            const limitedComments = commentList.slice( startIndex, endIndex );

            comments.push( limitedComments );
        }

        if( comments.length > 0 ){
            comments.forEach(
                async ( commentObject) => {
                    const commentedUser = await User.findById( commentObject.userId.toString() );
                    const commentedUserInfo = {
                    
                        userId: commentedUser._id
                                             .toString(),
                        userProfileImg: commentedUser.profileImg
                                                     .imgUrl,
                        username: commentedUser.userName,
                        userFullName: `${
                                commentedUser.identity
                                             .firstName
                            } ${
                                commentedUser.identity
                                             .middleName
                            } ${
                                commentedUser.identity
                                             .lastName
                            }`.replaceAll( "  ", " ")
                    }
                    commentObject.user = commentedUserInfo;
                    delete commentObject.userId;

                    for( let i = 0; i <= 5; i++ ){
                        const likedUser = await User.findById( commentObject.likes[ i ].toString() );
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
    
                        commentObject.firstFiveLikedUser.push( likedUserInfo );
                    }

                    const replyCount = commentObject.replies.length;
                    const lastReply = commentObject.replies.pop();
                    
                    commentObject.lastReply = lastReply;
                    commentObject.replyCount = replyCount;
                    delete commentObject.replies;
                }
            );

            const usersComments = comments.filter(
                commentObject =>
                    commentObject.user.userId === userId
            ).sort(
                ( a, b ) => 
                    b.createdAt - a.createdAt
            );

            const otherComments = comments.filter(
                commentObject =>
                    commentObject.user.userId !== userId
            ).sort(
                ( a, b ) => 
                    b.createdAt - a.createdAt
            );

            const resultCommentData = [...usersComments, ...otherComments];
            return res.status( 200 ).json(
                {
                    error: false,
                    message: "Comments Prepared succesfully",
                    commentCount: comments.length,
                    comments: resultCommentData
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
        console.log("ERROR: getAfterEventCommentsController - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default getAfterEventCommentsController;