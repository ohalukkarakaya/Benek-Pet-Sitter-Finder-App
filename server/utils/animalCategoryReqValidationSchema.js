import Joi from "joi";

const animalCategoryReqValidation = (body) => {
    const schema = Joi.object(
        {
          category: Joi.object().required().label("category").keys(
            {
              tr : Joi.string(),
              en: Joi.string()
            }
          ),
          animalName: Joi.object().required().label("category").keys(
            {
              tr : Joi.string(),
              en: Joi.string()
            }
          ),
        }
    );
    return schema.validate(body);
};

export { animalCategoryReqValidation };