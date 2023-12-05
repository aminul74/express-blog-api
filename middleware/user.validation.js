const yup = require("yup");
const validate = require("../middleware/validate.middleware");

const signupSchema = yup.object({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(4).max(10).required(),
});

const loginSchema = yup.object({
  username: yup.string().required(),
  password: yup.string().min(4).max(10).required(),
});

const passUpdateSchema = yup.object({
  old_password: yup.string().min(4).max(10).required(),
  new_password: yup.string().min(4).max(10).required(),
});

const validateSignup = validate(signupSchema);

const validateLogin = validate(loginSchema);

const validateUpdate = validate(passUpdateSchema);

module.exports = {
  validateSignup,
  validateLogin,
  validateUpdate,
};
