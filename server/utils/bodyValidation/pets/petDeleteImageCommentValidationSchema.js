import Joi from "joi";

const petDeleteImageCommentValidation = (params) => {
    const paramsSchema = Joi.object(
        {
          petId: Joi.string().required().label("petId"),
          imgId: Joi.string().required().label("imgId"),
          commentId: Joi.string().required().label("commentId"),
          replyId: Joi.string().label("replyId")
        }
    );
    return paramsSchema.validate(params);
};

export { petDeleteImageCommentValidation };