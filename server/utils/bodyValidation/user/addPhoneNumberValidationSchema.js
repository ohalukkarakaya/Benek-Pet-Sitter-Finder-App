import Joi from "joi";
import joiPhoneNumber from "joi-phone-number"

const joiPhoneNum = Joi.extend( joiPhoneNumber );

const addPhoneBodyValidation = ( body ) => {
    const schema = Joi.object(
        {
          phoneNumber: joiPhoneNum.string()
                                  .phoneNumber()
                                  .required()
                                  .label( "Phone Number" ),
        }
    );
    return schema.validate( body );
};

const verifyPhoneBodyValidation = ( body ) => {
  const schema = Joi.object(
      {
        phoneNumber: joiPhoneNum.string()
                                .phoneNumber()
                                .required()
                                .label( "Phone Number" ),

        otp: Joi.string()
                .required()
                .label( "otp" ),
      }
  );
  return schema.validate( body );
};

export { addPhoneBodyValidation, verifyPhoneBodyValidation };