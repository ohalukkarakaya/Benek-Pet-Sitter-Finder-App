import Joi from "joi";

const petImageLikeValidation = (body) => {
    const bodySchema = Joi.object(
        {
          petId: Joi.string().required().label("petId"),
          imgId: Joi.string().required().label("imgId"),
        }
    );
    return bodySchema.validate(body);
};

const petImageCommentLikeValidation = (body) => {
  const bodySchema = Joi.object(
      {
        petId: Joi.string().required().label("petId"),
        imgId: Joi.string().required().label("imgId"),
        commentId: Joi.string().required().label("commentId"),
        replyId: Joi.string().label("replyId"),
      }
  );
  return bodySchema.validate(body);
};

export { petImageLikeValidation, petImageCommentLikeValidation };