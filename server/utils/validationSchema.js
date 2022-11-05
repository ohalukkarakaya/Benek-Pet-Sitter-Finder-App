import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const signUpBodyValidation = (body) => {
    const schema = joi.object(
        {
          userName: Joi.string().required().label("User Name"),
          email: Joi.string().email().required().label("Email"),
          password: passwordComplexity().required().label("Password"),
        }
    );
    return schema.validate(body);
}

export { signUpBodyValidation }