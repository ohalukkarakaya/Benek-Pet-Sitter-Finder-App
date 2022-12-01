import Joi from "joi";

const handOverInvitationReqBodyValidation = (body) => {
    const bodySchema = Joi.object(
        {
          price: Joi.int().required().label("price"),
          priceUnit: Joi.string().required().valid('tl', 'usd').label("priceUnit")
        }
    );
    return bodySchema.validate(body);
};

const handOverInvitationReqParamsValidation = (params) => {
    const paramsSchema = Joi.object(
        {
          petId: Joi.string().required().label("petId"),
          invitedUserId: Joi.string().required().label("invitedUserId"),
        }
    );
    return paramsSchema.validate(params);
};

export { handOverInvitationReqBodyValidation, handOverInvitationReqParamsValidation };