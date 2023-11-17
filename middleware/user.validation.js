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

const validateSignup = validate(signupSchema);

const validateLogin = validate(loginSchema);

module.exports = {
  validateSignup,
  validateLogin,
};
