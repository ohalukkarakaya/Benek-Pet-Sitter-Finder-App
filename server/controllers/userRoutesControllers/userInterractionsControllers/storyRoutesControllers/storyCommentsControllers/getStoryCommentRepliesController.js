import User from "../../../../../models/User.js";
import Story from "../../../../../models/Story.js";

import getLightWeightUserInfoHelper from "../../../../../utils/getLightWeightUserInfoHelper.js";

const getStoryCommentRepliesController = async ( req, res ) => {
    try{ 
        const userId = req.user._id.toString();
        const storyId = req.params.storyId.toString();
        const commentId = req.params.commentId.toString();
        let lastElementId = req.params.lastElementId || 'null';
        let limit = parseInt( req.params.limit ) || 15;

        if( !storyId || !commentId ){
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

        const comment = story.comments.find(
            commentObject =>
                commentObject._id.toString() === commentId
        );

        if( !comment ){
            return res.status( 404 ).json({
                error: true,
                message: "Comment Not Found"
            });
        }

        let reversedReplies = comment.replies.reverse();
        let skip = lastElementId !== 'null' ? comment.replies.findIndex( replyObject => replyObject._id.toString() === lastElementId ) + 1 : 0;
        let replies = [];

        if( skip === 0 ){
            const usersReplies = comment.replies.filter(
                replyObject =>
                    replyObject.userId.toString() === userId
            );

            limit = limit - usersReplies.length;
            if( usersReplies.length > 0 ){
                replies.push(...usersReplies);
            }
        }

        if( limit > 0 ){
            const replyList = reversedReplies.filter(
                replyObject =>
                    replyObject.userId.toString() !== userId
            );

            const limitedReplies = commentList.slice(skip, skip + limit);
            comments.push(...limitedReplies);
        }

        if( replies.length > 0 ){
            for( let replyObject of replies ){
                const repliedUser = await User.findById( replyObject.userId.toString() );
                const repliedUserInfo = getLightWeightUserInfoHelper( repliedUser );

                replyObject.user = repliedUserInfo;
                delete replyObject.userId;

                let firstFiveOfLikeLimit = Math.min(replyObject.likes.length, 5);

                replyObject.firstFiveLikedUser = [];
                for( let i = 0; i < firstFiveOfLikeLimit; i++ ){
                    const likedUser = await User.findById( replyObject.likes[ i ].toString() );
                    const likedUserInfo = getLightWeightUserInfoHelper( likedUser );

                    replyObject.firstFiveLikedUser.push( likedUserInfo );
                }

                let diduserLiked = replyObject.likes.includes( userId );
                replyObject.didUserLiked = diduserLiked;

                replyObject.likeCount = replyObject.likes.length;
                delete replyObject.likes;
            }

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
                    message: "Reply List Prepared Successfully",
                    totalReplyCount: comment.replies.length,
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
        console.log("ERROR: getStoryCommentRepliesController - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default getStoryCommentRepliesController;