
//Validation
const Joi = require("@hapi/joi");


//Login validation functions
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports.loginValidation = loginValidation;
