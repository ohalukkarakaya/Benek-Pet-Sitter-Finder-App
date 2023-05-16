import User from "../../../../../models/User.js";
import Story from "../../../../../models/Story.js";
import getLightWeightUserInfoHelper from "../../../../../utils/getLightWeightUserInfoHelper.js";

const getStoryCommentsController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const storyId = req.params.storyId.toString();
        const skip = parseInt( req.params.skip ) || 0;
        const limit = parseInt( req.params.limit ) || 15;

        if( !storyId ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "Missing Param"
                }
            );
        }

        const story = await Story.findById( storyId );
        if( !story ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "Story Not Found"
                }
            );
        }

        const storyOwner = await User.findById( story.userId.toString() );
        if(
            !storyOwner
            || storyOwner.blockedUsers.includes( req.user._id.toString() )
        ){
            return res.status( 401 ).json(
                {
                    error: true,
                    message: "Unauthorized"
                }
            );
        }

        let comments;
        if( skip = 0 ){
            const usersComments = story.comments.filter(
                commentObject =>
                    commentObject.userId.toString() === userId
            );

            limit = limit - usersComments.length;
            comments = usersComments;
        }

        if( limit >= 0 ){
            const commentList = story.comments
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
                    const commentedUserInfo = getLightWeightUserInfoHelper( commentedUser );

                    commentObject.user = commentedUserInfo;
                    delete commentObject.userId;

                    let firstFiveOfLikeLimit = 5;
                    
                    if( replyObject.likes.length < 5 ){
                        firstFiveOfLikeLimit = replyObject.likes.length;
                    }

                    for( let i = 0; i <= firstFiveOfLikeLimit; i++ ){
                        const likedUser = await User.findById( commentObject.likes[ i ].toString() );
                        const likedUserInfo = getLightWeightUserInfoHelper( likedUser );
    
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
        console.log("ERROR: getStoryCommentsController - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default getStoryCommentsController;