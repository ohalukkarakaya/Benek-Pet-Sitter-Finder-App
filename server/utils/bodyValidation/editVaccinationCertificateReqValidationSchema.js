import Joi from "joi";

const editVaccinationCertificateValidation = (body) => {
    const schema = Joi.object(
        {
          certificateUrl: Joi.string().required().label("certificateUrl"),
          newDesc: Joi.string().max(50).required().label("newDesc"),
        }
    );
    return schema.validate(body);
};

export { editVaccinationCertificateValidation };