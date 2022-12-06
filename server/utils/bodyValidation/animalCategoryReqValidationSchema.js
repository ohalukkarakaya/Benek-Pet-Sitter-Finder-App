import Joi from "joi";

const animalCategoryReqValidation = (body) => {
    const schema = Joi.object(
        {
          selectedPetCategories: Joi.array().required().label("selectedPetCategories").items(
            Joi.object().required().keys(
                {
                  petId : Joi.string(),
                  speciesId : Joi.string(),
                }
              ),
          )
        }
    );
    return schema.validate(body);
};

export { animalCategoryReqValidation };