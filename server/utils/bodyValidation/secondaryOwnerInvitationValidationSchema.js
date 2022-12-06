import Joi from "joi";

const secondaryOwnerInvitationReqParamsValidation = (params) => {
    const paramsSchema = Joi.object(
        {
          petId: Joi.string().required().label("petId"),
          secondaryOwnerId: Joi.string().required().label("secondaryOwnerId"),
        }
    );
    return paramsSchema.validate(params);
};

export { secondaryOwnerInvitationReqParamsValidation };