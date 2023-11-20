const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const signUpRepo = async (username, email, password) => {
  try {
    const singleUser = await User.findOne({ where: { email: email } });

    if (singleUser) {
      const error = new Error("User already exist !");
      error.status = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
    });

    return newUser;
  } catch (error) {
    throw error;
  }
};

const logInRepo = async (username, password) => {
  try {
    const findUserWithUserName = await User.findOne({
      where: { username: username },
    });

    if (!findUserWithUserName) {
      const error = new Error("Username not found");
      error.status = 404;
      throw error;
    }

    const isValid = await bcrypt.compare(
      password,
      findUserWithUserName.password
    );

    if (!isValid) {
      const error = new Error("Wrong password");
      error.status = 401;
      throw error;
    }

    return isValid;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  signUpRepo,
  logInRepo,
};
