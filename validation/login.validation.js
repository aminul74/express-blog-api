const yup = require("yup");

const loginSchema = yup.object({
  username: yup.string().required(),
  password: yup.string().min(4).max(10).required(),
});

module.exports = loginSchema;