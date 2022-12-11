import Joi from "joi";

const petEditImageCommentValidation = (params) => {
    const paramsSchema = Joi.object(
        {
          petId: Joi.string().required().label("petId"),
          imgId: Joi.string().required().label("imgId"),
          commentId: Joi.string().required().label("commentId"),
          replyId: Joi.string().label("replyId"),
          newComment: Joi.string().required().label("newComment")
        }
    );
    return paramsSchema.validate(params);
};

export { petEditImageCommentValidation };