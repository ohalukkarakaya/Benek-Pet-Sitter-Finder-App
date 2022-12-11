import Joi from "joi";

const petEditImageCommentValidation = (params) => {
    const paramsSchema = Joi.object(
        {
          petId: Joi.string().required().label("petId"),
          imgId: Joi.string().required().label("imgId"),
          newComment: Joi.string().required().label("newComment"),
          commentId: Joi.string().label("commentId"),
        }
    );
    return paramsSchema.validate(params);
};

export { petEditImageCommentValidation };