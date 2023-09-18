import Event from "../../../../../models/Event/Event.js";
import dotenv from "dotenv";

dotenv.config();

const afterEventEditCommentOrReplyController = async ( req, res ) => {
    try{
        const eventId = req.params.eventId;
        const contentId = req.params.contentId;
        const commentId = req.body.commentId;
        const newComment = req.body.desc;

        const isReply = req.body.replyId;

        if(
            !eventId 
            || !contentId
            || !commentId
            || !newComment
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
                                            afterEventObject._id.toString() === contentId
                                    );
        if( !content ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "after event content not found"
                            }
                       );
        }

        const comment = content.comments
                               .find(
                                    commentObject =>
                                        commentObject._id.toString() === commentId
                                );
        if( !comment ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "comment not found"
                            }
                       );
        }

        if( isReply ){
            const reply = comment.replies
                                 .find(
                                    replyObject =>
                                        replyObject._id
                                                   .toString() === req.body
                                                                      .replyId
                                                                      .toString()
                                  );

            if(
                meetingEvent.eventAdmin.toString() !== req.user._id.toString()
                && comment.userId.toString() !== req.user._id.toString()
                && reply.userId.toString() !== req.user._id.toString()
            ){
                return res.status( 401 )
                          .json(
                                {
                                    error: true,
                                    message: "You can not edit this reply object"
                                }
                           );
            }
            
            reply.reply = newComment;
        }else{
            if(
                meetingEvent.eventAdmin.toString() !== req.user._id.toString()
                && comment.userId.toString() !== req.user._id.toString()
            ){
                return res.status( 401 )
                          .json(
                                {
                                    error: true,
                                    message: "You can not edit this comment object"
                                }
                           );
            }

            comment.comment = newComment;
        }

        meetingEvent.markModified( "afterEvent" );
        meetingEvent.save(
            ( error ) => {
                if(error){
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
                            message: "comment or reply edited succesfully"
                        }
                   );
    }catch( err ){
        console.log( "ERROR: after event delete comment - ", err );
        return res.status( 500 )
                  .json(
                        {
                            error: true,
                            message: "Internal server error"
                        }
                   );
    }
}

export default afterEventEditCommentOrReplyController;