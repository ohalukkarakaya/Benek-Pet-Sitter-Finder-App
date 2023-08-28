import Story from "../../../../../models/Story.js";

const likeStoryCommentOrReplyController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const storyId = req.body.storyId.toString();
        const commentId = req.body.commentId.toString();
        const replyId = req.body.replyId;

        if(
            !storyId
            || !commentId
        ){
            return res.status( 400 )
                      .json(
                        {
                            error: true,
                            message: "Missing params"
                        }
                      );
        }

        const story = await Story.findById( storyId );
        if( !story ){
            return res.status( 404 )
                      .json(
                        {
                            error: true,
                            message: "Story Not Found"
                        }
                      );
        }

        const storyComment = story.comments
                                  .find(
                                    commentObject =>
                                        commentObject._id
                                                     .toString() === commentId
                                  );
        if( !storyComment ){
            return res.status( 404 )
                      .json(
                        {
                            error: true,
                            message: "Comment Not Found"
                        }
                      );
        }

        if( replyId ){
            const reply = storyComment.replies
                                      .find(
                                        replyObject =>
                                            replyObject._id
                                                       .toString() === replyId
                                      );
            if( !reply ){
                return res.status( 404 )
                          .json(
                            {
                                error: true,
                                message: "Reply Not Found"
                            }
                          );
            }
            const isAlreadyLiked = reply.likes
                                        .find(
                                            likedUserId =>
                                                likedUserId.toString() === userId
                                        );
            if( isAlreadyLiked ){
                reply.likes = reply.likes
                                   .filter(
                                        likedUserId =>
                                            likedUserId.toString() !== userId
                                    );
            }else{
                reply.likes
                     .push( userId );
            }
            

            reply.likes = [...new Set( reply.likes )];

        }else{
            const isAlreadyLiked = storyComment.likes
                                               .find(
                                                likedUserId =>
                                                    likedUserId.toString() === userId
                                               );

            if( isAlreadyLiked ){
                storyComment.likes = storyComment.likes
                                                 .filter(
                                                    likedUserId =>
                                                        likedUserId.toString() !== userId
                                                 );
            }else{
                storyComment.likes
                            .push( userId );
            }
            

            storyComment.likes = [...new Set( storyComment.likes )];
        }

        story.markModified( "comments" );
        story.save(
            ( err ) => {
              if( err ) {
                  console.error('ERROR: While Update!');
              }
            }
        );

        return res.status( 200 )
                  .json(
                    {
                        error: false,
                        message: "Story Comment or Story Comment Reply Liked or Like Removed Succesfully"
                    }
                  )

    }catch( err ){
        console.log( "ERROR: likeStoryCommentOrReplyController - ", err );
        return res.status( 500 )
                  .json(
                    {
                        error: true,
                        message: "Internal Server Error"
                    }
                  );
    }
}

export default likeStoryCommentOrReplyController;