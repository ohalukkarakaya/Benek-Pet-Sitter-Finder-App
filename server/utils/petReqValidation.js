import Joi from "joi";

const createPetReqBodyValidation = (body) => {
    const schema = Joi.object(
        {
          userName: Joi.string().required().label("User Name"),
          email: Joi.string().email().required().label("Email"),
          identity: Joi.object().required().label("identity").keys(
            {
              firstName: Joi.string(),
              lastName: Joi.string()
            }
          ),
          location: Joi.object().required().label("location").keys(
            {
              country : Joi.string(),
              city: Joi.string(),
              lat: Joi.string(),
              lng: Joi.string()
            }
          ),
          password: passwordComplexity().required().label("Password"),
          ip: Joi.string().required().label("Ip"),
        }
    );
    return schema.validate(body);
};

export { createPetReqBodyValidation };