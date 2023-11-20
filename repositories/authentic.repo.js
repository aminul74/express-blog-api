const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const signUpRepo = async (username, email, password) => {
  try {
    const singleUser = await User.findOne({ where: { email: email } });

    if (singleUser) {
      throw new Error("User already exist !");
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
      throw new Error("Username not found");
    }

    const isValid = await bcrypt.compare(password, findUserWithUserName.password);

    if (!isValid) {
      throw new Error("Wrong password");
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
