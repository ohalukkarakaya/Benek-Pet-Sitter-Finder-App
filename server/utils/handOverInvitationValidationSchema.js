import Joi from "joi";

const handOverInvitationReqParamsValidation = (params) => {
    const paramsSchema = Joi.object(
        {
          petId: Joi.string().required().label("petId"),
          invitedUserId: Joi.string().required().label("invitedUserId"),
        }
    );
    return paramsSchema.validate(params);
};

export { handOverInvitationReqParamsValidation };