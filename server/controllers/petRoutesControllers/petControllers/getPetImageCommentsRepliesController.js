import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";
import getLightWeightUserInfoHelper from "../../../utils/getLightWeightUserInfoHelper.js";

const getPetImageCommentsRepliesController = async ( req, res ) => {
try{
    const userId = req.user._id.toString();
    const petId = req.params.petId.toString();
    const imageId = req.params.imageId.toString();
    const commentId = req.params.commentId.toString();
    const lastItemId = req.params.lastItemId || 'null';
    let limit = parseInt( req.params.limit ) || 15;

    if( !petId || !imageId || !commentId ){
        return res.status( 400 ).json({
            error: true,
            message: "Missing Params"
        });
    }

    const pet = await Pet.findById( petId ).lean();
    if( !pet ){
        return res.status( 404 ).json({
            eror: true,
            message: "Pet Not Found"
        });
    } 

    const image = pet.images.find(
        imageObject =>
            imageObject._id.toString() === imageId
    );

    const comment = image.comments.find(
        commentObject =>
            commentObject._id.toString() === commentId
    );

    if( !comment ){
        return res.status( 404 ).json({
            error: true,
            message: "Comment Not Found"
        });
    }

    let replies = [];

    let skip = lastItemId !== 'null' ? comment.replies.findIndex( repliesObject => repliesObject._id.toString() === lastItemId ) + 2 : 0;
    let usersReplies = comment.replies.filter(
        replyObject =>
            replyObject.userId.toString() === userId
    );

    if( skip === 0 || usersReplies.length > skip ){
        if( usersReplies.length > limit ){

            const startIndex = skip > 0 && usersReplies.length > skip
                                ? skip - 1 : 0;

            const endIndex = ( startIndex + limit ) > ( usersReplies.length -1 )
                                ? usersReplies.length -1 : startIndex + ( limit - 1 );

            usersReplies = usersReplies.slice( startIndex, endIndex );
        }

        limit = limit - usersReplies.length;
        replies = usersReplies;
    }

    if( limit >= 0 ){
        const replyList = comment.replies.reverse().filter(
            replyObject =>
                replyObject.userId.toString() !== userId
        );

        const startIndex = skip > 0 && replyList.length > skip
                             ? skip - 1 : 0;

        const endIndex = ( startIndex + limit ) > ( replyList.length -1 )
                            ? replyList.length -1 : startIndex + ( limit - 1 );

        const limitedReplies = replyList.slice( startIndex, endIndex );

        if( limitedReplies.length > 0 ){
            replies.push( ...limitedReplies );
        }
    }

    if( replies.length > 0 ){
        for( let replyObject of replies ){
            const repliedUser = await User.findById( replyObject.userId.toString() );
            const repliedUserInfo = getLightWeightUserInfoHelper( repliedUser );

            replyObject.user = repliedUserInfo;
            delete replyObject.userId;

            let firstFiveOfLikeLimit = 5;

            if( replyObject.likes.length < 5 ){
                firstFiveOfLikeLimit = replyObject.likes.length;
            }

            if( firstFiveOfLikeLimit > 0 ){
                for( let i = 0; i <= firstFiveOfLikeLimit - 1; i++ ){
                    const likedUser = await User.findById( replyObject.likes[ i ].toString() );
                    const likedUserInfo = getLightWeightUserInfoHelper( likedUser );
                    replyObject.firstFiveLikedUser = [];
                    replyObject.firstFiveLikedUser.push( likedUserInfo );
                }

                const likeCount = replyObject.likes.length;
                replyObject.likeCount = likeCount;
            }
            
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
        return res.status( 200 ).json({
            error: false,
            message: "Reply List Prepared Succesfully",
            replyCount: comment.replies.length,
            replies: resultreplyData
        });
    }else{
        return res.status( 404 ).json({
            error: true,
            message: "No Comment Found"
        });
    }

}catch( err ){
    console.log( "ERROR: getPetByIdController - ", err );
    return res.status( 500 ).json({
        error: true,
        message: "Internal Server Error"
    });
}
}

export default getPetImageCommentsRepliesController;