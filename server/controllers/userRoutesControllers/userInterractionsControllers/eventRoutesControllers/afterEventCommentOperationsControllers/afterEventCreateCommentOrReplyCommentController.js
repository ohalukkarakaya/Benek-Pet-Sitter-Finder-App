import Event from "../../../../../models/Event/Event.js";

import sendNotification from "../../../../../utils/notification/sendNotification.js";
import dotenv from "dotenv";

dotenv.config();

const afterEventCreateCommentOrReplyCommentController = async ( req, res ) => {
    try{
        const eventId = req.params.eventId;
        const contentId = req.params.contentId;
        const commentContent = req.body.desc;
        const isReply = req.body.commentId;

        if(
            !eventId 
            || !contentId 
            || !commentContent
        ){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "Missing params"
                            }
                       );
        }

        const meetingEvent = await Event.findById( eventId );
        if( !meetingEvent ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "Event not found"
                            }
                       );
        }

        const content = meetingEvent.afterEvent
                                    .find(
                                        afterEventObject =>
                                            afterEventObject._id
                                                            .toString() === contentId.toString()
                                    );
        if( !content ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "content not found"
                            }
                       );
        }

        if( isReply ){
            const comment = content.comments
                                   .find(
                                        commentObject =>
                                            commentObject._id
                                                         .toString() === req.body
                                                                            .commentId
                                                                            .toString()
                                    );
            if( !comment ){
                return res.status( 404 )
                          .json(
                                {
                                    error: true,
                                    message: "Comment not found"
                                }
                           );
            }

            comment.replies
                   .push(
                        {
                            userId: req.user._id.toString(),
                            reply: commentContent
                        }
                    );

            const insertedReply = comment.replies
                                         .find(
                                            reply =>
                                                reply.userId
                                                     .toString() === req.user
                                                                        ._id
                                                                        .toString()
                                                && reply.reply === req.body
                                                                      .desc
                                          );

            await sendNotification(
                req.user._id.toString(),
                comment.userId.toString(),
                "eventReply",
                insertedReply._id.toString(),
                "eventComment",
                req.body.commentId.toString(),
                "afterEvent",
                content._id.toString(),
                "event",
                eventId.toString()
            );

        }else{
            content.comments
                   .push(
                        {
                            userId: req.user._id.toString(),
                            comment: commentContent,
                        }
                    );

            const insertedComment = content.comments.find(
                                                        comment =>
                                                            comment.userId === req.user._id.toString()
                                                            && comment.comment === commentContent,
                                                     );

            await sendNotification(
                req.user._id.toString(),
                content.userId.toString(),
                "eventComment",
                insertedComment._id.toString(),
                "afterEvent",
                content._id.toString(),
                "event",
                eventId.toString(),
                null,
                null
            );
        }

        meetingEvent.markModified( "afterEvent" );
        meetingEvent.save(
            ( error ) => {
                if( error ){
                    console.log( error );
                    return res.status( 500 )
                              .json(
                                    {
                                        error: true,
                                        message: "Internal server error"
                                    }
                               );
                }
            }
        );

        return res.status( 200 )
                  .json(
                        {
                            error: false,
                            message: "content add succesfully"
                        }
                   );
    }catch(err){
        console.log("ERROR: after event comment - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default afterEventCreateCommentOrReplyCommentController;