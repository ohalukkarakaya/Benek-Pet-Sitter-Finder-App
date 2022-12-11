import Joi from "joi";

const petImageCommentValidation = (params) => {
    const paramsSchema = Joi.object(
        {
          petId: Joi.string().required().label("petId"),
          imgUrl: Joi.string().required().label("imgUrl"),
          comment: Joi.string().required().label("comment"),
          commentId: Joi.string().label("commentId"),
        }
    );
    return paramsSchema.validate(params);
};

export { petImageCommentValidation };