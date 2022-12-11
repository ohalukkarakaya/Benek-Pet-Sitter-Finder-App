import Joi from "joi";

const petDeleteImageCommentValidation = (body) => {
    const bodySchema = Joi.object(
        {
          petId: Joi.string().required().label("petId"),
          imgId: Joi.string().required().label("imgId"),
          commentId: Joi.string().required().label("commentId"),
          replyId: Joi.string().label("replyId")
        }
    );
    return bodySchema.validate(body);
};

const petEditImageCommentValidation = (body) => {
  const bodySchema = Joi.object(
      {
        petId: Joi.string().required().label("petId"),
        imgId: Joi.string().required().label("imgId"),
        commentId: Joi.string().required().label("commentId"),
        replyId: Joi.string().label("replyId"),
        newComment: Joi.string().required().label("newComment")
      }
  );
  return bodySchema.validate(body);
};

const petImageCommentValidation = (body) => {
  const bodySchema = Joi.object(
      {
        petId: Joi.string().required().label("petId"),
        imgId: Joi.string().required().label("imgId"),
        comment: Joi.string().required().label("comment"),
        commentId: Joi.string().label("commentId"),
      }
  );
  return bodySchema.validate(body);
};

export { petImageCommentValidation, petEditImageCommentValidation, petDeleteImageCommentValidation };