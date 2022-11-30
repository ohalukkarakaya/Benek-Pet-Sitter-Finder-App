import Joi from "joi";

const createPetReqBodyValidation = (body) => {
    const schema = Joi.object(
        {
          name: Joi.string().required().label("Name"),
          petBio: Joi.string().max(150).required().label("PetBio"),
          sex: Joi.string().required().valid('Male', 'Female').label("Sex"),
          birthDay: Joi.date().iso().required().label("birthday"),
          kindCode: Joi.string().required().label("KindCode"),
          speciesCode: Joi.string().required().label("SpeciesCode"),
        }
    );
    return schema.validate(body);
};

export { createPetReqBodyValidation };