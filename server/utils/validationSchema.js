import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const signUpBodyValidation = (body) => {
    const schema = Joi.object(
        {
          userName: Joi.string().required().label("User Name"),
          email: Joi.string().email().required().label("Email"),
          identity: Joi.string().email().required().label("identity"),
          firstName: Joi.string().email().label("identity").required().label("firstName"),
          lastName: Joi.string().email().label("identity").required().label("lastName"),
          location: Joi.string().email().required().label("location"),
          country: Joi.string().email().label("location").required().label("country"),
          city: Joi.string().email().label("location").required().label("city"),
          lat: Joi.string().email().label("location").required().label("lat"),
          lng: Joi.string().email().label("location").required().label("lng"),
          password: passwordComplexity().required().label("Password"),
        }
    );
    return schema.validate(body);
};

const loginBodyValidation = (body) => {
    const schema = Joi.object(
        {
          email: Joi.string().email().required().label("Email"),
          password: passwordComplexity().required().label("Password"),
        }
    );
};

export { signUpBodyValidation, loginBodyValidation }