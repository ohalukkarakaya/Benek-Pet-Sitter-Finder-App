import Pet from "../../../models/Pet.js";

const petImageEditCommentOrReplyController = async (req, res) => {
    try{
        const { error } = petEditImageCommentValidation( req.body );
        if(error)
            return res.status(400).json(
                {
                    error: true,
                    message: error.details[0].message
                }
            );

        const isReply = req.body.replyId !== undefined && req.body.replyId !== null;

        const pet = await Pet.findById( req.body.petId );

        if(!pet){
            console.log("pet couldn't found");
            return res.status(404).json(
                {
                    error: true,
                    message: "Pet couldn't found"
                }
            );
        }
            
        const image = pet.images.find(
            image =>
                image._id.toString() === req.body.imgId.toString()
        );
            
        if(image){

            const commentObject = image.comments.find(
                comment =>
                    comment._id.toString() === req.body.commentId.toString()
            );
            
            if(isReply){
                const replyObject = commentObject.replies.find(
                    reply =>
                        reply._id.toString() === req.body.replyId.toString()
                );

                if(
                    replyObject.userId.toString() !== req.user._id.toString()
                    && commentObject.userId.toString() !== req.user._id.toString()
                    && pet.primaryOwner.toString() !== req.ıser._id.toString()
                ){
                    return res.status(401).json(
                        {
                            error: true,
                            message: "You can't edit this comment"
                        }
                    );
                }

                replyObject.reply = req.body.newComment;
            }else{

                if(
                    commentObject.userId.toString() !== req.user._id.toString()
                    && pet.primaryOwner.toString() !== req.ıser._id.toString()
                ){
                    return res.status(401).json(
                        {
                            error: true,
                            message: "You can't edit this comment"
                        }
                    );
                }

                commentObject.comment = req.body.newComment;
            }

            pet.markModified("images");
            pet.save(
                (err) => {
                    if(err) {
                        console.error('ERROR: While Editing Comment!');
                        return res. status(500).json(
                            {
                                error: true,
                                message: "ERROR: While Editing Comment!"
                            }
                        );
                    }
                }
            );

            return res.status(200).json(
                {
                    error: false,
                    message: "Comment edited succesfully"
                }
            );
        }else{
            return res.status(404).json(
                {
                    error: true,
                    message: "image couldn't found"
                }
            );
        }
    }catch(err){
        console.log("error - edit", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default petImageEditCommentOrReplyController;