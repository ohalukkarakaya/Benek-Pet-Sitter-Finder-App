import Joi from "joi";

const editUserValidation = (body) => {
    const schema = Joi.object(
        {
          userId: Joi.string().required().label("User Id"),
        }
    );
    return schema.validate(body);
};

export default editUserValidation;