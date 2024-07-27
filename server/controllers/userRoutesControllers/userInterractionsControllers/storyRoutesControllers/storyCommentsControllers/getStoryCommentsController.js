import User from "../../../../../models/User.js";
import Story from "../../../../../models/Story.js";
import getLightWeightUserInfoHelper from "../../../../../utils/getLightWeightUserInfoHelper.js";

const getStoryCommentsController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const storyId = req.params.storyId.toString();
        const lastElementId = req.params.lastElementId || 'null';
        let limit = parseInt( req.params.limit ) || 15;
 
        if( !storyId ){
            return res.status( 400 ).json({
                error: true,
                message: "Missing Param"
            });
        }

        const story = await Story.findById( storyId ).lean();
        if( !story ){
            return res.status( 404 ).json({
                error: true,
                message: "Story Not Found"
            });
        }

        const storyOwner = await User.findById( story.userId.toString() );
        if( !storyOwner || storyOwner.blockedUsers.includes( req.user._id.toString() ) ){
            return res.status( 401 ).json({
                error: true,
                message: "Unauthorized"
            });
        }

        let skip = lastElementId !== 'null' ? story.comments.reverse().findIndex( commentObject => commentObject._id.toString() === lastElementId ) + 1 : 0;
        let comments = [];
        if( skip === 0 ){
            const usersComments = story.comments.filter(
                commentObject =>
                    commentObject.userId.toString() === userId
            );

            limit = limit - usersComments.length;
            if( usersComments.length > 0 ){
                for( let commentObject of usersComments ){
                    comments.push( commentObject );
                }
            }
        }

        if( limit >= 0 ){
            const commentList = story.comments.reverse().filter(
                commentObject =>
                    commentObject.userId.toString() !== userId
            );
            const startIndex = Math.abs(comments.length - ( skip - 1 ));
            const endIndex = startIndex + limit;

            const limitedComments = commentList.slice( startIndex, endIndex );

            if( limitedComments.length > 0 ){
                for( let commentObject of limitedComments ){
                    comments.push( commentObject );
                }
            }
        }

        if( comments.length > 0 ){
            for( let commentObject of comments ){
                const commentedUser = await User.findById( commentObject.userId.toString() );
                const commentedUserInfo = getLightWeightUserInfoHelper( commentedUser );

                commentObject.user = commentedUserInfo;
                delete commentObject.userId;

                let firstFiveOfLikeLimit = 5;
                
                if( commentObject.likes.length < 5 ){
                    firstFiveOfLikeLimit = commentObject.likes.length;
                }

                commentObject.firstFiveLikedUser = [];
                for( let i = 0; i < firstFiveOfLikeLimit; i++ ){
                    const likedUser = await User.findById( commentObject.likes[ i ].toString());
                    const likedUserInfo = getLightWeightUserInfoHelper( likedUser );

                    commentObject.firstFiveLikedUser.push( likedUserInfo );
                }

                const replyCount = commentObject.replies.length;
                let lastReply = commentObject.replies.length > 0
                                    ?   commentObject.replies.pop()
                                    : {};

                if( lastReply.likes ){
                    lastReply.likeCount = lastReply.likes.length;
                    delete lastReply.likes;
                }
                
                
                commentObject.lastReply = lastReply;
                commentObject.replyCount = replyCount;
                commentObject.likeCount = commentObject.likes.length;

                delete commentObject.likes;
                delete commentObject.replies;
            }

            let usersComments;
            let otherComments;

            if( comments.length > 0 ){
                usersComments = comments.filter(
                    commentObject =>
                        commentObject.user.userId.toString() === userId
                ).sort(
                    ( a, b ) => 
                        b.createdAt - a.createdAt
                );

                otherComments = comments.filter(
                    commentObject =>
                        commentObject.user.userId.toString() !== userId
                ).sort(
                    ( a, b ) => 
                        b.createdAt - a.createdAt
                );
            }

            const resultCommentData = [...usersComments, ...otherComments];
            return res.status( 200 ).json({
                error: false,
                message: "Comments Prepared succesfully",
                totalCommentCount: story.comments.length,
                commentCount: comments.length,
                comments: resultCommentData
            });
        }else{
            return res.status( 404 ).json({
                error: true,
                message: "No Comment Found"
            });
        }
    }catch( err ){
        console.log("ERROR: getStoryCommentsController - ", err);
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
}

export default getStoryCommentsController;