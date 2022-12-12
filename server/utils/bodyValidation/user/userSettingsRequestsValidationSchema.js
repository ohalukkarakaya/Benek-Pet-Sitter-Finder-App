import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const resetPasswordBodyValidation = (body) => {
    const schema = Joi.object(
        {
          oldPassword: Joi.string().required().label("oldPassword"),
          oldPasswordReply: Joi.string().required().label("oldPasswordReply"),
          newPassword: passwordComplexity().required().label("newPassword"),
        }
    );
    return schema.validate(body);
};

const resetEmailBodyValidation = (body) => {
    const schema = Joi.object(
        {
            newEmail: Joi.string().email().required().label("newEmail"),
        }
    );
    return schema.validate(body);
};

export { resetPasswordBodyValidation, resetEmailBodyValidation };