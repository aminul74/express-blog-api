const User = require("../models/user.model");

const signUpRepo = async (email) => {
  try {
    const findUserWithEmail = await User.findOne({ where: { email: email } });

    return findUserWithEmail;
  } catch (error) {
    return error;
  }
};

const logInRepo = async (username) => {
  try {
    const findUserWithUserName = await User.findOne({
      where: { username: username },
    });

    return findUserWithUserName;
  } catch (error) {
    return error;
  }
};

module.exports = {
  signUpRepo,
  logInRepo,
};
