import Pet from "../../../models/Pet.js";
import { petImageCommentValidation } from "../../../utils/bodyValidation/pets/petImageCommentsValidationSchemas.js";
import sendNotification from "../../../utils/notification/sendNotification.js";

const petImageCreateCommentOrReplyCommentController = async (req, res) => {
    try{
        const { error } = petImageCommentValidation( req.body );
        if( error )
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: error.details[ 0 ]
                                              .message
                            }
                      );
    
        const isReply = req.body
                           .commentId !== undefined

                        && req.body
                              .commentId !== null;

        const pet = await Pet.findById( 
                                    req.body
                                       .petId 
                              );

        if( !pet ){
            console.log( "pet couldn't found" );
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "Pet couldn't founs"
                            }
                      );
        }
            
        const image = pet.images
                         .find(
                            image =>
                                image._id
                                     .toString() === req.body
                                                        .imgId
                                                        .toString()
                         );
            
        if( image ){
            if( isReply ){
                const comment = image.comments
                                     .find(
                                            comment =>
                                                    comment._id
                                                           .toString() === req.body
                                                                              .commentId
                                                                              .toString()
                                      );
                
                comment.replies
                       .push(
                            {
                                userId: req.user
                                        ._id
                                        .toString(),
                                reply: req.body
                                        .comment
                            }
                        );

                const insertedReply = image.comments
                                           .find(
                    comment =>
                        comment._id
                               .toString() === req.body
                                                  .commentId
                                                  .toString()
                ).replies
                 .find(
                    reply =>
                        reply.userId === req.user
                                            ._id
                                            .toString()
                        && reply.reply === req.body
                                              .comment
                 );

                

            }else{
                image.comments
                     .push(
                        {
                            userId: req.user
                                       ._id
                                       .toString(),

                            comment: req.body
                                        .comment
                        }
                     );
            }

            pet.markModified("images");
            pet.save(
                ( err ) => {
                    if( err ) {
                        console.error( 'ERROR: While Inserting Comment!' );
                        return res.status( 500 )
                                  .json(
                                        {
                                            error: true,
                                            message: "ERROR: While Inserting Comment!"
                                        }
                                  );
                    }
                }
            );

            if( isReply ){
                const comment = image.comments
                                     .find(
                                            comment =>
                                                    comment._id
                                                           .toString() === req.body
                                                                              .commentId
                                                                              .toString()
                                      );
                                      
                const insertedReply = comment.replies[
                                                  comment.replies
                                                         .length - 1
                                              ];

                await sendNotification(
                    req.user._id.toString(),
                    comment.userId.toString(),
                    "petImageReply",
                    insertedReply._id.toString(),
                    "petImageComment",
                    req.body.commentId.toString(),
                    "petImage",
                    image._id.toString(),
                    "pet",
                    pet._id.toString()
                );
            }else{
                const insertedComment = image.comments[
                                                    image.comments
                                                         .length - 1
                                              ];
                await sendNotification(
                    req.user._id.toString(),
                    pet.primaryOwner.toString(),
                    "petImageComment",
                    insertedComment._id.toString(),
                    "petImage",
                    image._id.toString(),
                    "pet",
                    pet._id.toString(),
                    null,
                    null
                );
            }

            return res.status( 200 )
                      .json(
                        {
                            error: false,
                            message: "Comment saved succesfully"
                        }
                      );
        }else{
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "image couldn't found"
                            }
                      );
        }
    }catch(err){
        console.log( "ERROR: leave comment - ", err);
        return res.status( 500 )
                  .json(
                        {
                            error: true,
                            message: "Internal server error"
                        }
                  );
    }
}

export default petImageCreateCommentOrReplyCommentController;