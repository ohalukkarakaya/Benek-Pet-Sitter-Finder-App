import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";
import getLightWeightUserInfoHelper from "../../../utils/getLightWeightUserInfoHelper.js";

const getPetImageCommentsController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const petId = req.params.petId.toString();
        const imageId = req.params.imageId.toString();
        let skip = parseInt( req.params.skip ) || 0;
        let limit = parseInt( req.params.limit ) || 15;
        if(
            !petId
            || !imageId
        ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "Missing Params"
                }
            );
        }

        const pet = await Pet.findById( petId )
                             .lean();
        if( !pet ){
            return res.status( 404 ).json(
                {
                    eror: true,
                    message: "Pet Not Found"
                }
            );
        } 
        const image = pet.images
                         .find(
                            imageObject =>
                                imageObject._id
                                           .toString() === imageId
                         );

        let comments = [];

        let usersComments = image.comments
                                     .filter(
                                        commentObject =>
                                            commentObject.userId.toString() === userId
                                     );

        if( 
            skip === 0
            || usersComments.length > skip
        ){
            if( usersComments.length > limit ){

                const startIndex = skip > 0
                                   && usersComments.length > skip
                                    ? skip - 1
                                    : 0;

                const endIndex = ( startIndex + limit ) > ( usersComments.length -1 )
                                    ? usersComments.length -1
                                    : startIndex + ( limit - 1 );

                usersComments = usersComments.slice( startIndex, endIndex );
            }

            limit = limit - usersComments.length;
            comments = usersComments;
        }

        if( limit >= 0 ){
            const commentList = image.comments
                                     .reverse()
                                     .filter(
                                        commentObject =>
                                            commentObject.userId.toString() !== userId
                                      );

            const startIndex = skip > 0
                               && commentList.length > skip
                                ? skip - 1
                                : 0;

            const endIndex = ( startIndex + limit ) > ( commentList.length -1 )
                                ? commentList.length - 1
                                : startIndex + ( limit - 1 );

            const limitedComments = commentList.slice( startIndex, endIndex );
            
            if(
                limitedComments .length > 0
            ){
                comments.push( ...limitedComments );
            }
            
        }

        if( comments.length > 0 ){
            for(
                let commentObject
                of comments
            ){
                const commentedUser = await User.findById( 
                                                    commentObject.userId
                                                                 .toString() 
                                                 );
                                                 
                const commentedUserInfo = getLightWeightUserInfoHelper( commentedUser );

                commentObject.user = commentedUserInfo;

                delete commentObject.userId;

                let firstFiveOfLikeLimit = 5;

                if( 
                    commentObject.likes
                                 .length < 5
                ){
                    firstFiveOfLikeLimit = commentObject.likes
                                                        .length;
                }

                if(
                    firstFiveOfLikeLimit > 0
                ){
                    for(
                        let i = 0; 
                        i <= firstFiveOfLikeLimit - 1; 
                        i++ 
                    ){
                        const likedUser = await User.findById( 
                                                        commentObject.likes[ i ]
                                                                     .toString() 
                                                    );

                        const likedUserInfo = getLightWeightUserInfoHelper( likedUser );
                        
                        commentObject.firstFiveLikedUser = [];

                        commentObject.firstFiveLikedUser
                                     .push( likedUserInfo );
                    }

                    const likeCount = commentObject.likes
                                                   .length;

                    commentObject.likeCount = likeCount;
                }
                

                const replyCount = commentObject.replies
                                                .length;

                const lastReply = commentObject.replies
                                               .pop();

                commentObject.lastReply = lastReply;
                commentObject.replyCount = replyCount;
                delete commentObject.replies;
            }

            const usersComments = comments.filter(
                                                commentObject =>
                                                    commentObject.user
                                                                 .userId === userId
                                           ).sort(
                                                ( a, b ) => 
                                                    b.createdAt - a.createdAt
                                           );

            const otherComments = comments.filter(
                                                commentObject =>
                                                    commentObject.user
                                                                 .userId !== userId
                                           ).sort(
                                                ( a, b ) => 
                                                    b.createdAt - a.createdAt
                                           );

            const resultCommentData = [...usersComments, ...otherComments];
            return res.status( 200 ).json(
                {
                    error: false,
                    message: "Comments Prepared succesfully",
                    totalCommentCount: image.comments
                                       .length,
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
        console.log("ERROR: getPetImageCommentsController - ", err);
        res.status( 500 )
           .json(
                {
                    error: true,
                    message: "Internal Server Error"
                }
           );
    }
}

export default getPetImageCommentsController;