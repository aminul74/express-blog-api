const yup = require("yup");

const signupSchema = yup.object({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(4).max(10).required(),
});

module.exports = signupSchema;
 
